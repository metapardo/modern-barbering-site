import { randomBytes } from "node:crypto";
import { Router, type IRouter } from "express";
import { CreateEventRequestBody, CreateEventRequestResponse } from "@workspace/api-zod";
import { sendEventInquiryEmail } from "../lib/email";
import {
  clientIp,
  createRateLimiter,
  isHoneypotHit,
  isPlainObject,
  toFieldErrors,
  type FieldErrors,
} from "../lib/form-guard";

const router: IRouter = Router();

// Per-IP (PRD E7: 5 per 10 minutes) plus the original per-email limit.
const ipLimiter = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });
const emailLimiter = createRateLimiter({ max: 5, windowMs: 15 * 60 * 1000 });

const FIELD_MESSAGES: Record<string, string> = {
  contactName: "Please enter your name (up to 120 characters).",
  contactEmail: "Please enter a valid email address.",
  eventType: "Please describe the event type (up to 120 characters).",
  date: "Please choose a valid event date.",
  readyByTime: "Please choose a ready-by time.",
  numberOfGuests: "Number of guests must be a whole number from 1 to 1000.",
  location: "Please enter the location (up to 500 characters).",
  servicesNeeded: "Please describe the services needed (up to 2000 characters).",
  notes: "Notes can be up to 4000 characters.",
};

// Human-friendly reference, e.g. MB-20261021-4F3K (date in New York time).
const REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function newReference(now: Date): string {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now).replaceAll("-", "");
  const suffix = Array.from(randomBytes(4), (b) => REFERENCE_ALPHABET[b % REFERENCE_ALPHABET.length]).join("");
  return `MB-${day}-${suffix}`;
}

function validationFailed(fieldErrors: FieldErrors) {
  return { error: "Please check the highlighted fields.", fieldErrors };
}

router.post("/event-requests", async (req, res): Promise<void> => {
  // Honeypot: look like a normal success, send nothing.
  if (isHoneypotHit(req.body)) {
    req.log.info({ ip: clientIp(req) }, "Event inquiry honeypot triggered; discarded");
    res.status(201).json({ reference: newReference(new Date()), status: "received" });
    return;
  }

  const parsed = CreateEventRequestBody.safeParse(isPlainObject(req.body) ? req.body : {});
  if (!parsed.success) {
    res.status(400).json(validationFailed(toFieldErrors(parsed.error, FIELD_MESSAGES)));
    return;
  }
  const data = parsed.data;
  const fields = {
    contactName: data.contactName.trim(),
    contactEmail: data.contactEmail.trim().toLowerCase(),
    eventType: data.eventType.trim(),
    date: data.date,
    readyByTime: data.readyByTime,
    numberOfGuests: data.numberOfGuests,
    location: data.location.trim(),
    servicesNeeded: data.servicesNeeded.trim(),
    notes: (data.notes ?? "").trim(),
  };

  const fieldErrors: FieldErrors = {};
  for (const key of ["contactName", "eventType", "location", "servicesNeeded"] as const) {
    if (!fields[key]) fieldErrors[key] = FIELD_MESSAGES[key];
  }
  const eventDay = new Date(`${fields.date}T12:00:00Z`);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  if (!Number.isFinite(eventDay.getTime()) || eventDay.toISOString().slice(0, 10) !== fields.date) {
    fieldErrors.date = FIELD_MESSAGES.date;
  } else if (fields.date < today) {
    fieldErrors.date = "Please choose a date today or in the future.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    res.status(400).json(validationFailed(fieldErrors));
    return;
  }

  // No public inquiry listing: contact and venue details remain private.
  const retryAfter = ipLimiter.hit(clientIp(req)) ?? emailLimiter.hit(fields.contactEmail);
  if (retryAfter !== null) {
    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).json({ error: "Too many requests. Please try again in a few minutes." });
    return;
  }

  // Email is the only record of the inquiry, so a failed send is reported to the visitor.
  const submittedAt = new Date();
  const reference = newReference(submittedAt);
  const email = await sendEventInquiryEmail({ ...fields, reference, submittedAt });
  if (!email.ok) {
    req.log.error({ reference, reason: email.reason, detail: email.message }, "Event inquiry email failed; inquiry not delivered");
    res.status(503).json({
      error: "We couldn’t send your inquiry just now. Your details are still here, so please try again in a few minutes.",
    });
    return;
  }

  req.log.info({ reference, emailId: email.id }, "Event inquiry notification sent");
  res.status(201).json(CreateEventRequestResponse.parse({ reference, status: "received" }));
});

export default router;

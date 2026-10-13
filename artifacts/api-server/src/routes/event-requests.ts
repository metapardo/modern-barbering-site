import { Router, type IRouter } from "express";
import { db, eventRequestsTable } from "@workspace/db";
import { CreateEventRequestBody, CreateEventRequestResponse } from "@workspace/api-zod";

const router: IRouter = Router();
const recentSubmissions = new Map<string, { count: number; expires: number }>();
const WINDOW_MS = 15 * 60 * 1000;

router.post("/event-requests", async (req, res): Promise<void> => {
  const now = Date.now();
  for (const [key, value] of recentSubmissions) {
    if (value.expires < now) recentSubmissions.delete(key);
  }
  const parsed = CreateEventRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please check the required fields, email address, date and time." });
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
  if (!fields.contactName || !fields.eventType || !fields.location || !fields.servicesNeeded) {
    res.status(400).json({ error: "Please fill in all required fields." });
    return;
  }
  const eventDay = new Date(`${fields.date}T12:00:00Z`);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  if (!Number.isFinite(eventDay.getTime()) ||
      eventDay.toISOString().slice(0, 10) !== fields.date ||
      fields.date < today) {
    res.status(400).json({ error: "Please choose a valid event date today or in the future." });
    return;
  }
  // No public inquiry listing: contact and venue details remain private.
  const key = fields.contactEmail;
  const limit = recentSubmissions.get(key);
  if ((limit?.count ?? 0) >= 5 || recentSubmissions.size >= 10000) {
    res.setHeader("Retry-After", "900");
    res.status(429).json({ error: "Too many requests. Please try again in 15 minutes." });
    return;
  }
  recentSubmissions.set(key, { count: (limit?.count ?? 0) + 1, expires: limit?.expires ?? now + WINDOW_MS });
  try {
    const [saved] = await db.insert(eventRequestsTable).values(fields).returning({ reference: eventRequestsTable.id });
    res.status(201).json(CreateEventRequestResponse.parse({ reference: saved.reference, status: "received" }));
  } catch (error) {
    req.log.error({ err: error }, "Unable to save event inquiry");
    res.status(500).json({ error: "Your inquiry could not be saved. Please try again." });
  }
});

export default router;

import { Resend } from "resend";

/**
 * Outbound notification email via Resend.
 *
 * - RESEND_API_KEY is read only on the server and is never logged or returned.
 * - Every send resolves to an EmailResult; nothing here throws to the caller.
 * - All visitor-supplied text is HTML-escaped in the HTML body and stripped of
 *   line breaks in the subject.
 */

const DEFAULT_TO = "Atseanpardo@gmail.com";
const DEFAULT_FROM = "Modern Barbering <onboarding@resend.dev>";
const SEND_TIMEOUT_MS = 10_000;

export type EmailResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: "not_configured" | "send_failed" | "timeout"; message: string };

let client: Resend | null = null;
let clientKey: string | null = null;

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (!client || clientKey !== key) {
    client = new Resend(key);
    clientKey = key;
  }
  return client;
}

export function notifyToEmail(): string {
  return process.env.NOTIFY_TO_EMAIL?.trim() || DEFAULT_TO;
}

export function notifyFromEmail(): string {
  return process.env.NOTIFY_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapse whitespace/newlines so visitor text cannot break the subject line. */
function oneLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function formatNewYorkTime(date: Date): string {
  return (
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date)
  );
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

type Row = [label: string, value: string];

function renderContent(heading: string, rows: Row[], footer: string): Omit<EmailContent, "subject"> {
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;font-weight:600;white-space:nowrap;">${escapeHtml(label)}</th>` +
        `<td style="padding:6px 0;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const html =
    `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0B0B0C;">` +
    `<h2 style="font-weight:600;">${escapeHtml(heading)}</h2>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${htmlRows}</table>` +
    `<p style="margin-top:24px;color:#555;font-size:13px;">${escapeHtml(footer)}</p>` +
    `</body></html>`;
  const text = [heading, "", ...rows.map(([label, value]) => `${label}: ${value}`), "", footer].join("\n");
  return { html, text };
}

export interface EventInquiryEmailData {
  reference: string;
  submittedAt: Date;
  contactName: string;
  contactEmail: string;
  eventType: string;
  numberOfGuests: number;
  date: string;
  readyByTime: string;
  location: string;
  servicesNeeded: string;
  notes: string;
}

export function buildEventInquiryEmail(d: EventInquiryEmailData): EmailContent {
  const subject = oneLine(
    `New event inquiry: ${d.eventType}, ${d.numberOfGuests} guests, ${d.date} (${d.contactName})`,
  );
  const body = renderContent(
    "New event inquiry",
    [
      ["Reference", d.reference],
      ["Submitted", formatNewYorkTime(d.submittedAt)],
      ["Contact name", d.contactName],
      ["Email", d.contactEmail],
      ["Event type", d.eventType],
      ["Number of guests", String(d.numberOfGuests)],
      ["Date", d.date],
      ["Ready-by time (New York time)", d.readyByTime],
      ["Location", d.location],
      ["Services needed", d.servicesNeeded],
      ["Anything we should know?", d.notes.trim() ? d.notes : "Not provided"],
    ],
    "Reply to this email to respond to the contact directly. This inquiry is not a confirmed booking.",
  );
  return { subject, ...body };
}

async function send(content: EmailContent, replyTo: string): Promise<EmailResult> {
  const resend = getClient();
  if (!resend) {
    return { ok: false, reason: "not_configured", message: "RESEND_API_KEY is not set" };
  }
  let timer: NodeJS.Timeout | undefined;
  try {
    const timeout = new Promise<EmailResult>((resolve) => {
      timer = setTimeout(
        () => resolve({ ok: false, reason: "timeout", message: `Resend did not respond within ${SEND_TIMEOUT_MS}ms` }),
        SEND_TIMEOUT_MS,
      );
    });
    const attempt = resend.emails
      .send({
        from: notifyFromEmail(),
        to: [notifyToEmail()],
        replyTo,
        subject: content.subject,
        html: content.html,
        text: content.text,
      })
      .then(({ data, error }): EmailResult => {
        if (error) {
          return { ok: false, reason: "send_failed", message: `${error.name}: ${error.message}` };
        }
        return { ok: true, id: data?.id ?? null };
      });
    return await Promise.race([attempt, timeout]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, reason: "send_failed", message };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function sendEventInquiryEmail(data: EventInquiryEmailData): Promise<EmailResult> {
  return send(buildEventInquiryEmail(data), data.contactEmail);
}

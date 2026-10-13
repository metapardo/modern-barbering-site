import { date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventRequestsTable = pgTable("event_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  eventType: text("event_type").notNull(),
  date: date("event_date", { mode: "string" }).notNull(),
  readyByTime: text("ready_by_time").notNull(),
  numberOfGuests: integer("number_of_guests").notNull(),
  location: text("location").notNull(),
  servicesNeeded: text("services_needed").notNull(),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("received"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEventRequestSchema = createInsertSchema(eventRequestsTable).omit({
  id: true, status: true, createdAt: true,
});
export type InsertEventRequest = z.infer<typeof insertEventRequestSchema>;
export type EventRequest = typeof eventRequestsTable.$inferSelect;

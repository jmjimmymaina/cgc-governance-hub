import emailjs from "@emailjs/browser";
import { emailjsConfig } from "@/config/emailjs.config";
import type { Event } from "@/types/models";

interface SendRegistrationEmailParams {
  toEmail: string;
  userName: string;
  event: Event;
  confirmationRef: string;
  amountPaid: string; // e.g. "Free" or "5000"
}

/**
 * Sends a registration confirmation email via EmailJS.
 * For online events: includes platform, meeting link, meeting ID.
 * For physical events: includes venue and confirmation reference.
 */
export const sendRegistrationEmail = async (params: SendRegistrationEmailParams): Promise<boolean> => {
  const { toEmail, userName, event, confirmationRef, amountPaid } = params;

  const isOnline = event.meetingOption === "online";

  const templateParams: Record<string, string> = {
    to_email: toEmail,
    user_name: userName,
    event_title: event.title,
    event_date: event.date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    event_time: event.time,
    event_code: event.event_code,
    currency: event.currency || "KES",
    amount: amountPaid,
    confirmation_ref: confirmationRef,
    location_type: isOnline ? "Online" : "Physical",
    venue_or_link: isOnline
      ? `Platform: ${event.meetingLink ? "Zoom" : "TBA"} | Link: ${event.meetingLink || "TBA"} | Meeting ID: ${event.meetingId || "TBA"}`
      : event.location,
    platform: isOnline ? "Zoom" : "N/A",
    meeting_id: isOnline ? (event.meetingId || "TBA") : "N/A",
    meeting_link: isOnline ? (event.meetingLink || "TBA") : "N/A",
  };

  try {
    const response = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      templateParams,
      emailjsConfig.publicKey
    );
    console.log("[EmailJS] Email sent successfully:", response.status);
    return true;
  } catch (error) {
    console.error("[EmailJS] Failed to send email:", error);
    return false;
  }
};

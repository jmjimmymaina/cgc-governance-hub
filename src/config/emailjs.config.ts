// ============================================================
// EmailJS Configuration - EDIT THIS FILE TO SET YOUR CREDENTIALS
// ============================================================
// Sign up at https://www.emailjs.com/ and get your credentials.
// Create a template with the variables listed below.
//
// Template variables available:
//   {{to_email}}          - Recipient email
//   {{user_name}}         - Registrant full name
//   {{event_title}}       - Event title
//   {{event_date}}        - Event date (formatted)
//   {{event_time}}        - Event time
//   {{event_code}}        - Unique event code
//   {{currency}}          - Currency (USD/KES)
//   {{amount}}            - Amount paid or "Free"
//   {{confirmation_ref}}  - Unique confirmation reference
//   {{venue_or_link}}     - Venue address OR meeting link details
//   {{platform}}          - Meeting platform (for online events)
//   {{meeting_id}}        - Meeting ID (for online events)
//   {{meeting_link}}      - Meeting link URL (for online events)
//   {{location_type}}     - "Online" or "Physical"
// ============================================================

export const emailjsConfig = {
  serviceId: "YOUR_EMAILJS_SERVICE_ID",       // e.g. "service_abc123"
  templateId: "YOUR_EMAILJS_TEMPLATE_ID",     // e.g. "template_xyz789"
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",        // e.g. "user_xxxxxxx"
};

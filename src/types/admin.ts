// Types matching the backend MySQL schema exactly

export interface AdminEvent {
  id?: number;
  title: string;
  description: string;
  date: string; // ISO date string
  locationType: "physical" | "online" | "hybrid";
  locationDetails: string;
  isPaid: boolean;
  price: number | null;
  currency: "USD" | "KES";
  event_code: string;
  platform: string;
  meetingLink: string;
  meetingId: string;
}

export interface AdminRegistration {
  id: number;
  event_id: number;
  event_code: string;
  email: string;
  phone: string;
  full_name: string;
  id_passport: string;
  gender: string;
  organization: string;
  is_paid: boolean;
  price: number | null;
  currency: string;
  confirmation_ref: string;
  payment_reference: string;
  created_at: string;
}

export interface AdminGalleryItem {
  id?: number;
  filename: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface AdminStat {
  id?: number;
  label: string;
  value: string;
  icon: "Shield" | "Users" | "Scale";
}

export interface AdminTestimonial {
  id?: number;
  name: string;
  role: string;
  organization: string;
  quote: string;
}

export interface AdminTeamMember {
  id?: number;
  name: string;
  position: string;
  department: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  email: string;
  phone: string;
}

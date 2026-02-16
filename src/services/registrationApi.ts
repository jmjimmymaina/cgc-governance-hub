// ============================================================
// Registration API Service - PLUG & PLAY
// ============================================================
// Replace API_BASE_URL with your Node.js backend URL.
// This file calls your existing registrations.js endpoints.
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface RegistrationPayload {
  event_id: string;
  event_code: string;
  full_name: string;
  id_passport: string;
  gender: string;
  email: string;
  phone: string;
  organization: string;
  is_paid: boolean;
  price: number | null;
  currency: string;
  emergency_name?: string;
  emergency_relationship?: string;
  emergency_email?: string;
  emergency_phone?: string;
}

export interface RegistrationResponse {
  id: number;
  event_id: string;
  event_code: string;
  full_name: string;
  id_passport: string;
  gender: string;
  email: string;
  phone: string;
  organization: string;
  is_paid: boolean;
  price: number | null;
  currency: string;
  confirmation_ref: string;
  payment_reference: string;
  created_at: string;
}

export const registrationApiService = {
  /**
   * POST /api/registrations
   * Creates a new registration. Backend generates confirmation_ref and sends email.
   */
  create: async (data: RegistrationPayload): Promise<RegistrationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  },

  /**
   * GET /api/registrations
   * Fetches all registrations.
   */
  getAll: async (): Promise<RegistrationResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/registrations`);
    if (!response.ok) throw new Error("Failed to fetch registrations");
    return response.json();
  },

  /**
   * GET /api/registrations/:id
   * Fetches a single registration by ID.
   */
  getById: async (id: number): Promise<RegistrationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/registrations/${id}`);
    if (!response.ok) throw new Error("Registration not found");
    return response.json();
  },

  /**
   * GET /api/registrations/ref/:confirmationRef
   * Fetches a registration by confirmation reference.
   */
  getByRef: async (ref: string): Promise<RegistrationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/registrations/ref/${ref}`);
    if (!response.ok) throw new Error("Registration not found");
    return response.json();
  },

  /**
   * PUT /api/registrations/:id/payment
   * Updates payment status after payment is confirmed.
   */
  updatePayment: async (id: number, paymentReference: string): Promise<RegistrationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/registrations/${id}/payment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_reference: paymentReference, is_paid: true }),
    });
    if (!response.ok) throw new Error("Payment update failed");
    return response.json();
  },

  /**
   * DELETE /api/registrations/:id
   */
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/registrations/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete failed");
  },
};

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { registrationApiService } from "@/services/registrationApi";
import { sendRegistrationEmail } from "@/services/emailService";
import type { Event } from "@/types/models";
import EventConfirmation from "./EventConfirmation";

const registrationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  idPassport: z.string().trim().min(1, "ID/Passport number is required").max(50),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().min(1, "Phone number is required").regex(/^[0-9+\-\s()]+$/, "Invalid phone number").max(20),
  organization: z.string().trim().min(1, "Organization is required").max(200),
  hasEmergencyContact: z.boolean().default(false),
  emergencyName: z.string().max(100).optional(),
  emergencyRelationship: z.string().max(100).optional(),
  emergencyEmail: z.string().email("Invalid email").max(255).optional().or(z.literal("")),
  emergencyPhone: z.string().regex(/^[0-9+\-\s()]*$/, "Invalid phone").max(20).optional().or(z.literal("")),
});

type FormData = z.infer<typeof registrationSchema>;

interface Props {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConfirmationState {
  confirmationRef: string;
  registrationId: number;
  event: Event;
  isPaid: boolean;
  paymentCompleted: boolean;
  email: string;
  userName: string;
}

const EventRegistrationForm = ({ event, open, onOpenChange }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const { toast } = useToast();

  const isFree = event.price === "free";
  const priceDisplay = isFree ? "Free" : `${event.currency || "KES"} ${typeof event.price === "number" ? event.price.toLocaleString() : event.price}`;

  const form = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "", idPassport: "", gender: undefined, email: "", phone: "",
      organization: "", hasEmergencyContact: false, emergencyName: "",
      emergencyRelationship: "", emergencyEmail: "", emergencyPhone: "",
    },
  });

  const hasEmergency = form.watch("hasEmergencyContact");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Call your backend API to create registration
      const result = await registrationApiService.create({
        event_id: event.id,
        event_code: event.event_code,
        full_name: data.fullName,
        id_passport: data.idPassport,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        is_paid: !isFree,
        price: typeof event.price === "number" ? event.price : null,
        currency: event.currency || "KES",
        emergency_name: data.hasEmergencyContact ? data.emergencyName : undefined,
        emergency_relationship: data.hasEmergencyContact ? data.emergencyRelationship : undefined,
        emergency_email: data.hasEmergencyContact ? data.emergencyEmail : undefined,
        emergency_phone: data.hasEmergencyContact ? data.emergencyPhone : undefined,
      });

      const confState: ConfirmationState = {
        confirmationRef: result.confirmation_ref,
        registrationId: result.id,
        event,
        isPaid: !isFree,
        paymentCompleted: false,
        email: data.email,
        userName: data.fullName,
      };

      if (isFree) {
        // Free event: send email immediately with all details
        await sendRegistrationEmail({
          toEmail: data.email,
          userName: data.fullName,
          event,
          confirmationRef: result.confirmation_ref,
          amountPaid: "Free",
        });

        setConfirmation({ ...confState, paymentCompleted: true });
        toast({ title: "Registration successful!", description: `Ref: ${result.confirmation_ref}` });
      } else {
        // Paid event: show payment prompt first
        setConfirmation(confState);
        setShowPaymentPrompt(true);
        toast({ title: "Registration saved", description: "Please complete payment to confirm your booking." });
      }
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = async (paymentReference: string) => {
    if (!confirmation) return;
    try {
      // Update payment in backend
      await registrationApiService.updatePayment(confirmation.registrationId, paymentReference);

      // Now send email with event details
      await sendRegistrationEmail({
        toEmail: confirmation.email,
        userName: confirmation.userName,
        event: confirmation.event,
        confirmationRef: confirmation.confirmationRef,
        amountPaid: typeof event.price === "number" ? event.price.toLocaleString() : String(event.price),
      });

      setConfirmation({ ...confirmation, paymentCompleted: true });
      setShowPaymentPrompt(false);
      toast({ title: "Payment confirmed!", description: "Confirmation email sent. Your booking is now confirmed." });
    } catch (err: any) {
      toast({ title: "Payment update failed", description: err.message || "Please try again.", variant: "destructive" });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setConfirmation(null);
    setShowPaymentPrompt(false);
    form.reset();
  };

  // Show confirmation screen (after free registration or after payment)
  if (confirmation && !showPaymentPrompt && confirmation.paymentCompleted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <EventConfirmation
            confirmationRef={confirmation.confirmationRef}
            event={confirmation.event}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Show payment prompt for paid events
  if (showPaymentPrompt && confirmation) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Your registration is saved. Please complete payment of{" "}
              <strong className="text-foreground">{priceDisplay}</strong>{" "}
              to confirm your booking and receive event details via email.
            </p>
            <div className="bg-secondary rounded-lg p-4 border border-border space-y-2">
              <p className="text-sm"><strong>Ref:</strong> {confirmation.confirmationRef}</p>
              <p className="text-sm"><strong>Event:</strong> {event.title}</p>
              <p className="text-sm"><strong>Event Code:</strong> {event.event_code}</p>
              <p className="text-sm"><strong>Amount:</strong> {priceDisplay}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase">Payment Methods (Coming Soon)</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" disabled className="opacity-60">PayPal</Button>
                <Button variant="outline" disabled className="opacity-60">M-Pesa</Button>
              </div>
            </div>
            <Button onClick={() => handlePaymentComplete("DEMO-PAY-" + Date.now())} className="w-full">
              Simulate Payment (Demo)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Register for Event</DialogTitle>
        </DialogHeader>

        {/* Read-only Event Fields */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event Title</label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={event.title} readOnly className="bg-muted cursor-not-allowed font-medium" />
              <Lock size={14} className="text-muted-foreground shrink-0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={isFree ? "Free" : String(event.price)} readOnly className="bg-muted cursor-not-allowed font-medium" />
                <Lock size={14} className="text-muted-foreground shrink-0" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Currency</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={isFree ? "N/A" : (event.currency || "KES")} readOnly className="bg-muted cursor-not-allowed font-medium" />
                <Lock size={14} className="text-muted-foreground shrink-0" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event Code</label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={event.event_code || "—"} readOnly className="bg-muted cursor-not-allowed font-mono font-medium" />
              <Lock size={14} className="text-muted-foreground shrink-0" />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground mb-3">Your Details</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="idPassport" render={({ field }) => (
                <FormItem>
                  <FormLabel>ID/Passport Number *</FormLabel>
                  <FormControl><Input placeholder="12345678" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl><Input placeholder="+254 700 000 000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="organization" render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization *</FormLabel>
                  <FormControl><Input placeholder="Your organization" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Emergency Contact Toggle */}
              <div className="flex items-center justify-between pt-2 pb-1 border-t border-border">
                <span className="text-sm font-medium">Emergency Contact (Optional)</span>
                <FormField control={form.control} name="hasEmergencyContact" render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )} />
              </div>

              {hasEmergency && (
                <div className="space-y-3 pl-3 border-l-2 border-primary/30">
                  <FormField control={form.control} name="emergencyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Emergency contact name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="emergencyRelationship" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl><Input placeholder="e.g. Spouse, Colleague" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="emergencyEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="emergency@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="emergencyPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="+254 700 000 000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                ) : (
                  isFree ? "Register Now" : "Register & Proceed to Payment"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationForm;

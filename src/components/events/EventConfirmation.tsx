import { CheckCircle, MapPin, Monitor, Calendar, Clock, Copy, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateICalEvent, downloadICalFile, getGoogleCalendarUrl } from "@/lib/ical";
import type { Event } from "@/types/models";

interface Props {
  confirmationRef: string;
  event: Event;
  onClose: () => void;
}

const EventConfirmation = ({ confirmationRef, event, onClose }: Props) => {
  const { toast } = useToast();

  const copyRef = () => {
    navigator.clipboard.writeText(confirmationRef);
    toast({ title: "Copied!", description: "Reference copied to clipboard." });
  };

  const handleDownloadIcal = () => {
    const ical = generateICalEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
    });
    downloadICalFile(ical, event.title.replace(/\s+/g, "-").toLowerCase());
  };

  const googleUrl = getGoogleCalendarUrl({
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
  });

  const priceLabel = event.price === "free"
    ? "Free"
    : `${event.currency || "KES"} ${typeof event.price === "number" ? event.price.toLocaleString() : event.price}`;

  return (
    <div className="space-y-6 py-2">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Registration Confirmed!</h2>
        <p className="text-muted-foreground mt-1">A confirmation email has been sent to you.</p>
      </div>

      {/* Confirmation Reference */}
      <div className="bg-secondary rounded-lg p-4 border border-border text-center">
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Confirmation Reference</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-primary tracking-wider">{confirmationRef}</span>
          <button onClick={copyRef} className="text-muted-foreground hover:text-primary transition-colors">
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Event Details</h3>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold">{event.title}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="text-primary" />
            <span>{event.date.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} className="text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{event.type === "training" ? "Training" : "Workshop"}</Badge>
            <Badge className={event.price === "free" ? "bg-primary/10 text-primary border-primary/30" : "bg-primary text-primary-foreground"}>
              {priceLabel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Meeting / Venue Details */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">
          {event.meetingOption === "online" ? "Meeting Details" : "Venue Details"}
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          {event.meetingOption === "online" ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Monitor size={14} className="text-primary" />
                <span className="font-medium">Platform: Zoom</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Meeting Link: </span>
                <a href={event.meetingLink || "#"} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {event.meetingLink || "Will be shared via email"}
                </a>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Meeting ID: </span>
                <span className="font-medium">{event.meetingId || "Will be shared via email"}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 bg-secondary p-2 rounded">
                ⚠️ This meeting link is unique to your registration. Do not share it with others.
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-primary" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Export */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleDownloadIcal} className="flex-1">
          <Download size={14} className="mr-1" /> Download .ics
        </Button>
        <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <ExternalLink size={14} className="mr-1" /> Google Calendar
          </Button>
        </a>
      </div>

      <Button onClick={onClose} className="w-full">Close</Button>
    </div>
  );
};

export default EventConfirmation;

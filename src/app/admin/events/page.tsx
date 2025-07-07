"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Phone, Mail, Search } from "lucide-react";
import { mockAPI } from "@/lib/mock-api";
import { toast } from "sonner";
import { ReservationStatus } from "@/types/mock-api";

interface PrivateEvent {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  event_type: string;
  guests: number;
  status: string;
  notes?: string;
  created_at: string;
}

export default function PrivateEventsPage() {
  const [events, setEvents] = useState<PrivateEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<PrivateEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const statusOptions = ["all", "pending", "confirmed", "cancelled"];

  const fetchEvents = async () => {
    try {
      const data = await mockAPI.getPrivateEvents();
      setEvents(data);
    } catch {
      toast.error("Failed to fetch private events");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = useCallback(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.event_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (event) => event.status.toLowerCase() === statusFilter
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const updateEventStatus = async (id: string, status: ReservationStatus) => {
    try {
      await mockAPI.updateEventStatus(id, status);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? { ...event, status } : event))
      );
      toast.success(`Event ${status} successfully`);
    } catch {
      toast.error("Failed to update event status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Private Events</h1>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Private Events</h1>
        <p className="text-muted-foreground">
          Manage private event requests and bookings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No private event requests have been made yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <CardDescription>
                      {event.event_type} for {event.guests}{" "}
                      {event.guests === 1 ? "guest" : "guests"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{event.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{event.phone}</span>
                  </div>
                </div>

                {event.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {event.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {event.status !== "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => updateEventStatus(event.id, "confirmed")}
                    >
                      Confirm
                    </Button>
                  )}
                  {event.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateEventStatus(event.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  )}
                  {event.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateEventStatus(event.id, "pending")}
                    >
                      Mark Pending
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

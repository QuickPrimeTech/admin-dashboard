"use client";

import { SettingsSkeleton } from "./settings-skeleton";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/server/supabase";
import {
  Save,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
interface RestaurantSettings {
  id?: string;
  restaurant_name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  tiktok_url: string;
  opening_hours: string;
  is_open: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>({
    restaurant_name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    instagram_url: "",
    facebook_url: "",
    twitter_url: "",
    youtube_url: "",
    tiktok_url: "",
    opening_hours: "",
    is_open: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel("restaurant_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // "INSERT", "UPDATE", or "DELETE"
          schema: "public",
          table: "restaurant_settings",
        },
        (payload) => {
          if (
            payload.eventType === "UPDATE" ||
            payload.eventType === "INSERT"
          ) {
            setSettings(payload.new as RestaurantSettings);
            toast.success("Settings updated in real-time");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/restaurant-settings");
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch settings");
      }

      setSettings(json.data); // Assuming json.data is your settings object
    } catch {
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof RestaurantSettings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    if (!settings.id) {
      toast.error("Missing settings ID");
      setSaving(false); // Add this
      return;
    }
    try {
      const res = await fetch("/api/restaurant-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings), // includes the `id` field
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save settings");
      }

      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your restaurant settings and social media links
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      {loading ? (
        <SettingsSkeleton />
      ) : (
        <div className="grid gap-6">
          {/* Restaurant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Basic information about your restaurant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant_name">Restaurant Name</Label>
                  <Input
                    id="restaurant_name"
                    value={settings.restaurant_name}
                    onChange={(e) =>
                      handleInputChange("restaurant_name", e.target.value)
                    }
                    placeholder="Enter restaurant name"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Currently Open</Label>
                    <div className="text-sm text-muted-foreground">
                      Toggle restaurant open/closed status
                    </div>
                  </div>
                  <Switch
                    checked={settings.is_open}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_open", checked)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your restaurant..."
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opening_hours">Opening Hours</Label>
                <Textarea
                  id="opening_hours"
                  value={settings.opening_hours}
                  onChange={(e) =>
                    handleInputChange("opening_hours", e.target.value)
                  }
                  placeholder="Mon-Fri: 11:00 AM - 10:00 PM&#10;Sat-Sun: 10:00 AM - 11:00 PM"
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="info@restaurant.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street, City, State 12345"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">
                  <Globe className="inline h-4 w-4 mr-2" />
                  Website
                </Label>
                <Input
                  id="website"
                  value={settings.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://www.restaurant.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">
                    <Instagram className="inline h-4 w-4 mr-2" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram_url"
                    value={settings.instagram_url}
                    onChange={(e) =>
                      handleInputChange("instagram_url", e.target.value)
                    }
                    placeholder="https://instagram.com/yourrestaurant"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">
                    <Facebook className="inline h-4 w-4 mr-2" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook_url"
                    value={settings.facebook_url}
                    onChange={(e) =>
                      handleInputChange("facebook_url", e.target.value)
                    }
                    placeholder="https://facebook.com/yourrestaurant"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_url">
                    <Twitter className="inline h-4 w-4 mr-2" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter_url"
                    value={settings.twitter_url}
                    onChange={(e) =>
                      handleInputChange("twitter_url", e.target.value)
                    }
                    placeholder="https://twitter.com/yourrestaurant"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube_url">
                    <Youtube className="inline h-4 w-4 mr-2" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube_url"
                    value={settings.youtube_url}
                    onChange={(e) =>
                      handleInputChange("youtube_url", e.target.value)
                    }
                    placeholder="https://youtube.com/@yourrestaurant"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tiktok_url">
                    <div className="inline-flex items-center">
                      <div className="h-4 w-4 mr-2 bg-black rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                      </div>
                      TikTok
                    </div>
                  </Label>
                  <Input
                    id="tiktok_url"
                    value={settings.tiktok_url}
                    onChange={(e) =>
                      handleInputChange("tiktok_url", e.target.value)
                    }
                    placeholder="https://tiktok.com/@yourrestaurant"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      )}{" "}
    </div>
  );
}

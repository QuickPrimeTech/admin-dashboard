import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@ui/card";
import { ChefHat, Users, Calendar, Star } from "lucide-react";

export function LoginHero() {
  const features = [
    {
      icon: ChefHat,
      title: "Menu Management",
      description: "Easily manage your restaurant's menu items and pricing",
    },
    {
      icon: Calendar,
      title: "Reservations",
      description: "Track and manage customer reservations efficiently",
    },
    {
      icon: Users,
      title: "Private Events",
      description: "Handle private event bookings and special occasions",
    },
    {
      icon: Star,
      title: "Gallery & Social",
      description: "Showcase your restaurant with photos and social media",
    },
  ];

  return (
    <ScrollArea className="h-screen">
      <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-primary/20  to-primary/5 p-8 text-foreground">
        <div className="flex flex-col justify-center max-w-lg mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-primary-foreground rounded-lg flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Restaurant Admin</h1>
                <p className="text-muted-foreground">Management Dashboard</p>
              </div>
            </div>
            <p className="text-lgleading-relaxed">
              Streamline your restaurant operations with our comprehensive
              management platform. Handle everything from menu updates to
              customer reservations in one place.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card key={index} className="bg-transparent backdrop-blur-md">
                <div className="flex items-start gap-3 px-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <feature.icon className="size-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Trusted by restaurants worldwide to manage their operations
              efficiently
            </p>
          </div>
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}

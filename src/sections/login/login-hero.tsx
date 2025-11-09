import { Card } from "@/components/ui/card";
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
    <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
      <div className="flex flex-col justify-center max-w-lg mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Restaurant Admin</h1>
              <p className="text-slate-300">Management Dashboard</p>
            </div>
          </div>
          <p className="text-lg text-slate-200 leading-relaxed">
            Streamline your restaurant operations with our comprehensive
            management platform. Handle everything from menu updates to customer
            reservations in one place.
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/10 border-white/20 backdrop-blur-sm p-4"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-sm text-slate-400 text-center">
            Trusted by restaurants worldwide to manage their operations
            efficiently
          </p>
        </div>
      </div>
    </div>
  );
}

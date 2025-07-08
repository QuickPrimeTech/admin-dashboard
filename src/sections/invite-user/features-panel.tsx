import { ChefHat, Calendar, Users, Star } from "lucide-react";

export function FeaturesPanel() {
  return (
    <div className="hidden lg:flex flex-1 bg-slate-800 max-w-3xl text-white p-12 flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white rounded-lg p-2">
            <ChefHat className="h-6 w-6 text-slate-800" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Restaurant Admin</h1>
            <p className="text-slate-300 text-sm">Management Dashboard</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 mb-8 md:mb-12 text-base md:text-lg leading-relaxed">
          Streamline your restaurant operations with our comprehensive
          management platform. Handle everything from menu updates to customer
          reservations in one place.
        </p>

        {/* Feature Cards */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-slate-700/50 rounded-xl p-4 md:p-6 border border-slate-600/50">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-slate-600 rounded-lg p-2 md:p-3">
                <ChefHat className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm md:text-base">
                  Menu Management
                </h3>
                <p className="text-slate-300 text-xs md:text-sm">
                  Easily manage your restaurant's menu items and pricing
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4 md:p-6 border border-slate-600/50">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-slate-600 rounded-lg p-2 md:p-3">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm md:text-base">
                  Reservations
                </h3>
                <p className="text-slate-300 text-xs md:text-sm">
                  Track and manage customer reservations efficiently
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4 md:p-6 border border-slate-600/50">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-slate-600 rounded-lg p-2 md:p-3">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm md:text-base">
                  Private Events
                </h3>
                <p className="text-slate-300 text-xs md:text-sm">
                  Handle private event bookings and special occasions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4 md:p-6 border border-slate-600/50">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-slate-600 rounded-lg p-2 md:p-3">
                <Star className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm md:text-base">
                  Gallery & Social
                </h3>
                <p className="text-slate-300 text-xs md:text-sm">
                  Showcase your restaurant with photos and social media
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-slate-400 text-sm">
        Trusted by restaurants worldwide to manage their operations efficiently
      </p>
    </div>
  );
}

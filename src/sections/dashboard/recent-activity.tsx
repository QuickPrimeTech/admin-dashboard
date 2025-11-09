import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";

export function RecentActivity() {
  const activities = [
    {
      message: "New reservation added",
      time: "2 minutes ago",
      color: "bg-green-500",
    },
    {
      message: "Menu item updated",
      time: "1 hour ago",
      color: "bg-blue-500",
    },
    {
      message: "Private event request",
      time: "3 hours ago",
      color: "bg-orange-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates across your restaurant</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

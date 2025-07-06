import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickActions() {
  const actions = ["Add new menu item", "View today's reservations", "Upload gallery photos", "Update FAQ section"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you might want to perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <button key={index} className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors">
              {action}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under development. You will be able to update your profile here soon.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your password and security preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under development. You will be able to manage security settings here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

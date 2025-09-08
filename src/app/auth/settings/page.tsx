import { Button } from '@/ui/components/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card/Card';
import { Input } from '@/ui/components/Input/Input';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-1 font-sketch">
                Name
              </label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1 font-sketch">
                Email
              </label>
              <Input id="email" type="email" defaultValue="your@email.com" disabled />
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-bold mb-1 font-sketch">
                Current Password
              </label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-bold mb-1 font-sketch">
                New Password
              </label>
              <Input id="newPassword" type="password" />
            </div>
            <Button>Change Password</Button>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground font-sans">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete My Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

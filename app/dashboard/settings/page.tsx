"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant settings</p>
      </div>

      <Separator />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input id="restaurantName" defaultValue="Royal Bistro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Restaurant Street, Lagos" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+234 801 234 5678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="info@royalbistro.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Input id="operatingHours" defaultValue="11:00 AM - 11:00 PM" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Email Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new orders
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reservation Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new reservations
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Security Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Billing Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <p className="text-sm text-muted-foreground">
                  Professional Plan
                </p>
              </div>
              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <p className="text-sm text-muted-foreground">Monthly</p>
              </div>
              <div className="space-y-2">
                <Label>Next Billing Date</Label>
                <p className="text-sm text-muted-foreground">March 1, 2024</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

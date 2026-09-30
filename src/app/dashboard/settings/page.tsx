"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  Camera,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Plus,
  Settings,
  ShieldCheck,
  Smartphone,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store";
import { DEMO_USERS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

function Toggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        checked ? "bg-primary" : "bg-foreground/15"
      )}
    >
      <span
        className={cn(
          "inline-block size-4 transform rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1"
        )}
        aria-hidden="true"
      />
    </button>
  );
}

function SavedBadge({ show }: { show: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium text-success transition-opacity",
        show ? "opacity-100" : "opacity-0"
      )}
    >
      <CheckCircle2 className="size-3.5" aria-hidden="true" />
      Saved
    </span>
  );
}

function PrefRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:size-5">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SecurityCard({
  currentPass,
  setCurrentPass,
  newPass,
  setNewPass,
  confirmPass,
  setConfirmPass,
  twoFactor,
  setTwoFactor,
  saved,
  onSave,
}: {
  currentPass: string;
  setCurrentPass: (v: string) => void;
  newPass: string;
  setNewPass: (v: string) => void;
  confirmPass: string;
  setConfirmPass: (v: string) => void;
  twoFactor: boolean;
  setTwoFactor: (v: boolean) => void;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Security</CardTitle>
            <CardDescription>Password and two-factor authentication</CardDescription>
          </div>
        </div>
        <SavedBadge show={saved} />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <Input
            label="Current password"
            type="password"
            placeholder="Enter current password"
            icon={<KeyRound />}
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="New password"
              type="password"
              placeholder="Enter new password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat new password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted">
            Must be at least 8 characters long with a mix of letters and numbers.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-foreground/[0.02] px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent [&>svg]:size-5">
              <ShieldCheck />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Two-factor authentication
              </p>
              <p className="text-xs text-muted">
                Require a code when you sign in from a new device.
              </p>
            </div>
          </div>
          <Toggle checked={twoFactor} onCheckedChange={setTwoFactor} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}

export default function SettingsPage() {
  const currentUser = useAuthStore((s) => s.user) ?? DEMO_USERS[0];
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone ?? "");
  const [profileSaved, setProfileSaved] = useState(false);

  const [emailPrefs, setEmailPrefs] = useState(true);
  const [pushPrefs, setPushPrefs] = useState(true);
  const [smsPrefs, setSmsPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({ name, email, phone: phone || undefined });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleSavePrefs = () => {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2200);
  };

  const handleSaveSecurity = () => {
    setSecuritySaved(true);
    setTimeout(() => setSecuritySaved(false), 2200);
  };

  const handleDeactivate = () => {
    if (
      window.confirm(
        "Temporarily deactivate your account? Your listings will be hidden until you log back in."
      )
    ) {
      alert("Account deactivated. This is a demo action.");
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Permanently delete your account? This removes all listings, orders and data. This cannot be undone."
      )
    ) {
      alert("Account deleted. This is a demo action.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <Settings className="size-6 text-primary" aria-hidden="true" />
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your profile, security and preferences.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Smartphone className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information and public profile</CardDescription>
            </div>
          </div>
          <SavedBadge show={profileSaved} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar
                name={name}
                src={currentUser.avatar || undefined}
                size="xl"
                alt="Your avatar"
              />
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100"
                aria-label="Change photo"
              >
                <Camera className="size-5" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-foreground">{currentUser.name}</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                {currentUser.verified ? (
                  <>
                    <BadgeCheck className="size-3.5 text-primary" />
                    Verified account
                  </>
                ) : (
                  "Not yet verified"
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                Member since {new Date(currentUser.joinDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              icon={<Smartphone />}
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email address"
              type="email"
              icon={<Mail />}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Input
            label="Phone number"
            type="tel"
            icon={<Phone />}
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile}>Save Profile</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bell className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive updates</CardDescription>
            </div>
          </div>
          <SavedBadge show={prefsSaved} />
        </CardHeader>
        <CardContent className="space-y-3">
          <PrefRow
            icon={<Mail />}
            title="Email notifications"
            description="Order confirmations, receipts and important alerts."
          >
            <Toggle checked={emailPrefs} onCheckedChange={setEmailPrefs} />
          </PrefRow>
          <PrefRow
            icon={<Bell />}
            title="Push notifications"
            description="Real-time updates about your listings and exchanges."
          >
            <Toggle checked={pushPrefs} onCheckedChange={setPushPrefs} />
          </PrefRow>
          <PrefRow
            icon={<Smartphone />}
            title="SMS notifications"
            description="Ticket transfer codes sent as text messages."
          >
            <Toggle checked={smsPrefs} onCheckedChange={setSmsPrefs} />
          </PrefRow>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePrefs}>Save Preferences</Button>
        </CardFooter>
      </Card>

      <SecurityCard
        currentPass={currentPass}
        setCurrentPass={setCurrentPass}
        newPass={newPass}
        setNewPass={setNewPass}
        confirmPass={confirmPass}
        setConfirmPass={setConfirmPass}
        twoFactor={twoFactor}
        setTwoFactor={setTwoFactor}
        saved={securitySaved}
        onSave={handleSaveSecurity}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <IndianRupee className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">UPI (PhonePe)</p>
                <p className="text-xs text-muted">priya@upi · Last used 2 days ago</p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              Default
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Visa ending 4521</p>
                <p className="text-xs text-muted">Expires 08/2028</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10 hover:text-danger">
              Remove
            </Button>
          </div>

          <Button variant="secondary" leftIcon={<Plus className="size-4" />}>
            Add Payment Method
          </Button>
          <p className="text-xs text-muted">
            Payments are simulated in this demo. No real transactions are processed.
          </p>
        </CardContent>
      </Card>

      <Card className="border-danger/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger">
            <TriangleAlert className="size-5" aria-hidden="true" />
            Danger Zone
          </CardTitle>
          <CardDescription>Actions in this section cannot be easily undone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Temporarily deactivate account</p>
              <p className="text-xs text-muted">
                Hide your listings and profile from the marketplace until you log back in.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeactivate}
            >
              Deactivate
            </Button>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Permanently delete account</p>
              <p className="text-xs text-muted">
                Removes all your listings, orders, exchange history and personal data forever.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="size-3.5" />}
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
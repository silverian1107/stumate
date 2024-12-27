'use client';

import { UserDetails } from './_components/UserDetails';

export default function AccountPage() {
  return (
    <div className="container mx-auto py-6 space-y-6 pl-4">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <p className="text-muted-foreground">Manage your account preferences</p>
      <UserDetails />
    </div>
  );
}

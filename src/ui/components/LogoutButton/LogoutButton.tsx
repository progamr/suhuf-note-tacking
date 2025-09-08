'use client';

import { Button } from '../Button/Button';
import { signOutUser } from '../../../modules/auth/services/AuthService';

export function LogoutButton() {
  return (
    <form action={signOutUser}>
      <Button type="submit" variant="outline">
        Logout
      </Button>
    </form>
  );
}

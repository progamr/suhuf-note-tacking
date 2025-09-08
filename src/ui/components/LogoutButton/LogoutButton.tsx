'use client';

import { Button } from '../Button/Button';
import { handleSignOut } from '../../../modules/auth/actions';

export function LogoutButton() {
  return (
    <form action={handleSignOut}>
      <Button type="submit" variant="outline">
        Logout
      </Button>
    </form>
  );
}

'use server';

import { signOut } from '../../infrastructure/auth/auth';

export async function handleSignOut() {
  await signOut({ redirectTo: '/' });
}

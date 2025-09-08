import { auth } from '../modules/auth/config/auth.config';
import { AuthHome } from '../modules/conversations/components/AuthHome/AuthHome';
import { GuestHome } from '../modules/auth/components/GuestHome/GuestHome';

export default async function RootPage() {
  const session = await auth();

  return session?.user ? <AuthHome /> : <GuestHome />;
}

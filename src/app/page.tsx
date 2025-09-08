import { auth } from '../infrastructure/auth/auth';
import { AuthHome } from '../ui/components/AuthHome/AuthHome';
import { GuestHome } from '../ui/components/GuestHome/GuestHome';

export default async function RootPage() {
  const session = await auth();

  return session?.user ? <AuthHome /> : <GuestHome />;
}

import { AuthHome } from '../ui/components/AuthHome';
import { GuestHome } from '../ui/components/GuestHome';

export default function RootPage() {
  // Temporary flag for authentication
  const isAuthenticated = false;

  return isAuthenticated ? <AuthHome /> : <GuestHome />;
}

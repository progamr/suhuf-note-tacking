import { auth } from '../modules/auth/config/auth.config';
import { AuthHome } from '../modules/conversations/components/AuthHome/AuthHome';
import { GuestHome } from '../modules/auth/components/GuestHome/GuestHome';
import { NewChatWrapper } from '../modules/conversations/components/NewChatWrapper';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ tab?: string; 'new-chat'?: string }>;
}

export default async function RootPage({ searchParams }: PageProps) {
  const session = await auth();
  const params = await searchParams;
  const tab = params.tab || 'conversations';
  const showNewChat = params['new-chat'] === 'true';

  if (!session?.user) {
    return <GuestHome />;
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthHome tab={tab} />
      </Suspense>
      <NewChatWrapper isOpen={showNewChat} />
    </>
  );
}

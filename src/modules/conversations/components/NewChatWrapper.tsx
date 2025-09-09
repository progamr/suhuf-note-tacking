'use client';

import { useRouter } from 'next/navigation';
import { NewChatDialog } from './NewChatDialog';

interface NewChatWrapperProps {
  isOpen: boolean;
}

export function NewChatWrapper({ isOpen }: NewChatWrapperProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <NewChatDialog 
      isOpen={isOpen} 
      onClose={handleClose} 
    />
  );
}

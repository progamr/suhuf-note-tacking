import { CreateConversationForm } from '../../modules/conversations/components/CreateConversationForm';

export default function ConversationsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Conversations</h1>
      <CreateConversationForm />
    </div>
  );
}

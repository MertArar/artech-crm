import ChatPageContent from "@/components/chat/ChatPageContent";
import { chatConversations, chatMessages } from "@/data/chat";
import { users } from "@/data/users";

export default function ChatPage() {
  return (
    <ChatPageContent
      users={users}
      conversations={chatConversations}
      messages={chatMessages}
    />
  );
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConversationState {
  conversationId: string | null;
  setConversationId: (conversationId: string) => void;
  clearConversationId: () => void;
}

const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      conversationId: null,
      setConversationId: (conversationId: string) => set({ conversationId }),
      clearConversationId: () => set({ conversationId: null }),
    }),
    {
      name: 'conversation-store', // Name of the storage (e.g., localStorage key)
    }
  )
);

export default useConversationStore;

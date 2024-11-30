// store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConversationState {
  conversationId: string | null;
  isAuthenticated: boolean; // Add this property
  setConversationId: (conversationId: string) => void;
  clearConversationId: () => void;
  setIsAuthenticated: (value: boolean) => void; // Add setter for the boolean value
}

const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      conversationId: null,
      isAuthenticated: false, // Default value is false
      setConversationId: (conversationId: string) => set({ conversationId }),
      clearConversationId: () => set({ conversationId: null }),
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }), // Set isAuthenticated
    }),
    {
      name: "conversation-store", // Name of the storage (e.g., localStorage key)
    }
  )
);

export default useConversationStore;

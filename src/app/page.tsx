"use client";
import React, { useState, useEffect, useRef } from "react";
import MessageInput from "@/components/chatbot-components/MessageInput";
import { Bot, ChevronLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CustomMarkdownComponents } from "@/components/chatbot-components/CustomMarkdownComponents";
import botLogo from "@/assets/botLogo.svg";
import Image from "next/image";
import TypewriterText from "@/components/chatbot-components/TypewriterText";
import { RespondQuery } from "@/helper/constant";
import optAiLogo from "@/assets/optAiLogo.png";
import useConversationStore from "@/store/useConversationStore";
import { Skeleton } from "@/components/ui/skeleton";
import { v4 as uuidv4 } from 'uuid';

interface Message {
  sender: "user" | "bot";
  content: string;
  isStreaming?: boolean;
}

interface Messages {
  ai_response: string;
  datetime: string;
  id: string;
  user_query: string;
}

interface Conversation {
  last_active_datetime: string;
  messages: Messages[];
  session_id: string;
  start_datetime: string;
  title: string;
}

// Dummy conversations data
export const conversations: Conversation[] = [
  {
    last_active_datetime: "2024-11-25T09:00:00.000000Z",
    messages: [
      {
        ai_response: "Welcome! How can I help you today?",
        datetime: "2024-11-25T08:55:00.123456Z",
        id: "d7f8e9c0-a1b2-3c4d-5e6f-7g8h9i0j1k2l",
        user_query: "Hello",
      },
    ],
    session_id: "abcdef12-3456-7890-abcd-ef1234567890",
    start_datetime: "2024-11-25T08:50:00.000000Z",
    title: "Chat with AI",
  },
  {
    last_active_datetime: "2024-11-24T10:30:00.000000Z",
    messages: [
      {
        ai_response: "hello from bot!",
        datetime: "2024-11-24T10:25:00.123456Z",
        id: "d7f8e9c0-a1b2-3c4d-5e6f-7g8h9i0j1k2l",
        user_query: "Hello",
      },
    ],
    session_id: "ghijkl34-5678-9101-abcd-ef1234567890",
    start_datetime: "2024-11-24T10:00:00.000000Z",
    title: "Chat with another",
  },
];

export default function ChatBot() {
  const { conversationId } = useConversationStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const streamingMessageRef = useRef<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  console.log("hello", conversationId);

  useEffect(() => {
    setIsMessageLoading(true); // Trigger skeleton loading
    const timer = setTimeout(() => {
      setIsMessageLoading(false); // Stop skeleton loading after 2 seconds
    }, 2000);
    return () => clearTimeout(timer);
  }, [conversationId]);
  
  


  
  // useEffect(() => {
  //   const fetchConversation = async () => {
  //     // Fetch the conversation data asynchronously
  //     const response = await fetch(`/api/conversations/${conversationId}`);
  //     const conversation = await response.json();
  //     // Transform and set messages as before
  //   };
  //   fetchConversation();
  // }, [conversationId]);

  // New useEffect to listen for changes in conversationId
  useEffect(() => {
    // Find the conversation matching the current conversationId
    const conversation = conversations.find(
      (conv) => conv.session_id === conversationId
    );

    if (conversation) {
      // Transform the conversation messages to match the Message[] format
      const transformedMessages:any = conversation.messages
        .map((msg) => [
          { sender: "user", content: msg.user_query },
          { sender: "bot", content: msg.ai_response },
        ])
        .flat();

      // Update the messages state
      setMessages(transformedMessages);
    } else {
      // If no conversation is found, clear the messages
      setMessages([]);
    }
  }, [conversationId]);

  const handleSend = async (message: string) => {
    setIsStreaming(true);
    streamingMessageRef.current = "";

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", content: message },
      { sender: "bot", content: "", isStreaming: true },
    ]);

    await getBotResponse(message, isNewConversation, (chunk) => {
      streamingMessageRef.current += chunk;
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (lastMessage && lastMessage.isStreaming) {
          lastMessage.content = streamingMessageRef.current;
        }
        return updatedMessages;
      });
      scrollToBottom();
    });

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      if (lastMessage) {
        lastMessage.isStreaming = false;
      }
      return updatedMessages;
    });

    focusInput();
    setIsStreaming(false);
    setIsNewConversation(false); // Set to false after the first message
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);
  const skeletonMessages = [
    {
      sender: "user",
      content: "Hello, how can I help you today?",
    },
    {
      sender: "bot",
      content: "Hello, how can I help you today?",
    },
  ]

  async function getBotResponse(
    message: string,
    isNewConversation: boolean,
    onMessageChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      console.log("message", isNewConversation);
      const response = await fetch(RespondQuery, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

  session_id: uuidv4(),
  user_id: "user123",
  query: message,
  fixed_data: {
    token: "optional-token"
  }




          // fixed_data: { user_id: "rooms@atithipondicherry.com" },
          // query: message,
          // reset: isNewConversation, // Conditionally set reset based on conversation state
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send the query");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Preserve incomplete line

        lines.forEach((line) => {
          if (line.startsWith("data: ") && line.includes("message_chunk")) {
            const data = line.slice(6).trim();
            if (data) {
              try {
                const parsedData = JSON.parse(data);
                if (parsedData.message_chunk) {
                  onMessageChunk(parsedData.message_chunk);
                }
              } catch (error) {
                console.error("Error parsing message chunk:", error);
              }
            }
          }
        });
      }
    } catch (error) {
      console.error("Error with fetch:", error);
      onMessageChunk("Error retrieving response.");
    }
  }

  return (
    <div className="flex flex-col items-center bg-[#131314] h-full w-full  p-4 overflow-hidden">
   

      <div className="w-full max-w-[900px] bg- container mx-auto mt-6 flex flex-col items-center">
        <div className="flex-grow w-full overflow-y-auto scrollbar-hide space-y-4 h-[78vh] mb-4">
          {
            isMessageLoading ?(
              skeletonMessages.map((msg, index)=>(
                <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-2 ${
                        msg.sender === "user"
                          ? "flex-row-reverse items-start"
                          : "items-end"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User color="white" size={24} />
                      ) : (
                        <Image src={botLogo} alt="bot" width={24} height={24} />
                      )}
                      <div
                        className={`p-2 rounded-lg max-w-[75%] ${
                          msg.sender === "user"
                            ? `bg-[#2F2F2F] text-white text-right`
                            : "bg-[#2F2F2F] text-white text-left"
                        }`}
                      >
                        <Skeleton className="h-4 w-[250px]"/>
                      </div>
                    </div>
                  </div>
              ))
            ):
            (
              messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-2 ${
                        msg.sender === "user"
                          ? "flex-row-reverse items-start"
                          : "items-end"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User color="white" size={24} />
                      ) : (
                        <Image src={botLogo} alt="bot" width={24} height={24} />
                      )}
                      <div
                        className={`p-2 rounded-lg max-w-[75%] ${
                          msg.sender === "user"
                            ? `bg-[#2F2F2F] text-white text-right`
                            : "bg-[#2F2F2F] text-white text-left"
                        }`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={CustomMarkdownComponents}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col gap-4 items-center justify-center w-full h-[80%] mt-10 overflow-hidden">
                  <Image src={optAiLogo} alt="bot" width={150} height={150} />
                  <TypewriterText />
                </div>
              )
            )
          }
       
          <div ref={messagesEndRef} />
        </div>

        <div className="w-full">
          <MessageInput
            onSend={handleSend}
            disabled={isStreaming}
            styles="bg-[#1E1F20] text-[#BBC3C2] w-full mx-auto px-4 py-3"
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  );
}

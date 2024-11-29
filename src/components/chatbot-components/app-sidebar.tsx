"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { format, isToday, isYesterday, subDays } from "date-fns";
import optAiLogo from "@/assets/optAiLogo.png";

import Image from "next/image";
import useConversationStore from "@/store/useConversationStore";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { FetchAllConversation } from "@/helper/constant";
import axios from "axios"

interface Message {
  ai_response: string;
  datetime: string;
  id: string;
  user_query: string;
}

interface Conversation {
  last_active_datetime: string;
  messages: Message[];
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
        ai_response: "Welcome! How can I help you today?",
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

// Function to categorize conversations
function categorizeConversations(conversations: Conversation[]): {
  today: Conversation[];
  yesterday: Conversation[];
  previous7Days: Conversation[];
} {
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const previous7Days: Conversation[] = [];

  conversations.forEach((conversation) => {
    const lastActiveDate = new Date(conversation.last_active_datetime);
    if (isToday(lastActiveDate)) {
      today.push(conversation);
    } else if (isYesterday(lastActiveDate)) {
      yesterday.push(conversation);
    } else if (lastActiveDate >= subDays(new Date(), 7)) {
      previous7Days.push(conversation);
    }
  });

  return { today, yesterday, previous7Days };
}

export function AppSidebar(): JSX.Element {
  const [conversations, setConversations] =useState<Conversation[]>([])
  const { conversationId, setConversationId, clearConversationId } =
    useConversationStore();

  const { today, yesterday, previous7Days } =
    categorizeConversations(conversations);

  const newConversationHandler = (e?: React.MouseEvent) => {
    if(e){
      e.preventDefault();
    }
  
    clearConversationId();
    setConversationId(uuidv4());
  };
  const getAllConversations = async()=>{
    try{

        const res = await axios.get(`${FetchAllConversation}?user_id=user123`)
        console.log("res", res)
        if(!conversationId){
          newConversationHandler()
        }
        setConversations(res.data)
    }catch(error){
      console.error("error while getting conversations", error)
    }
  }
  useEffect(()=>{
getAllConversations()
  },[])

  return (
    <Sidebar className="!text-gray-100 w-64 z-[9999] " >
      <SidebarContent className=" h-screen overflow-y-auto bg-[#2e2e2f] w-full">
        {/* Header */}
        <SidebarGroupLabel className="flex items-start justify-items-start mt-2">
          {/* <SidebarGroupLabel className="text-white"></SidebarGroupLabel> */}
         <h1 className="text-2xl font-bold text-blue-400 ml-10 ">N+</h1>
        </SidebarGroupLabel>

        <SidebarMenu className="mt-4">
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-white">
                <button
                  className="px-4 py-2 !text-md"
                  onClick={newConversationHandler}
                >
                  New Chat
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
          {/* Today Section */}
          
          {today.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 !text-white">
                Today
              </SidebarGroupLabel>
              <div className="flex flex-col gap-3">
              {today.map((conversation) => (
                <SidebarMenuItem key={conversation.session_id}>
                  <SidebarMenuButton asChild isActive={conversationId === conversation.session_id} className="text-white">
                    <button
                      className="block px-4 py-2 !text-md "
                      onClick={() => {
                        clearConversationId();
                        setConversationId(conversation.session_id);
                      }}
                    >
                      <span>{conversation.title}</span>
                      {/* <small className="block text-gray-400 text-xs">
                        Last active:{" "}
                        {format(
                          new Date(conversation.last_active_datetime),
                          "hh:mm a"
                        )}
                      </small> */}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              </div>
            </SidebarGroup>
          )}

          {/* Yesterday Section */}
          
          {yesterday.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 mt-2 !text-white">
                Yesterday
              </SidebarGroupLabel>
              <div className="flex flex-col gap-3">
              {yesterday.map((conversation) => (
                <SidebarMenuItem key={conversation.session_id}>
                  <SidebarMenuButton asChild isActive={conversationId === conversation.session_id} className="text-white">
                    <button
                      className="block px-4 py-2 w-full item-start !text-md hover:bg-white hover:text-black"
                      onClick={() => {
                        clearConversationId();
                        setConversationId(conversation.session_id);
                      }}
                    >
                      <span>{conversation.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
                   </div>
            </SidebarGroup>
          )}
     

          {/* Previous 7 Days Section */}
          {previous7Days.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 mt-2 !text-white">
                Previous 7 Days
              </SidebarGroupLabel>
            <div className="flex flex-col gap-3">
            {previous7Days.map((conversation) => (
                <SidebarMenuItem key={conversation.session_id}>
                  <SidebarMenuButton asChild isActive={conversationId === conversation.session_id} className="text-white">
                    <button
                      className="block px-4 py-2 !text-md"
                      onClick={() => {
                        clearConversationId();
                        setConversationId(conversation.session_id);
                      }}
                    >
                      <span>{conversation.title}</span>
                      {/* <small className="block text-gray-400 text-xs">
                          Last active: {format(new Date(conversation.last_active_datetime), "MMM d, hh:mm a")}
                        </small> */}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>
            </SidebarGroup>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

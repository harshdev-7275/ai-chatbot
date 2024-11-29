"use client";
import React, { useState } from "react";
import { SendHorizonal } from "lucide-react";

interface MessageInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  styles?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}

export default function MessageInput({
  placeholder = "Type a message...",
  onSend,
  styles = "",
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const handleSend = () => {
    if (onSend && message.trim()) {
      
      onSend(message);
      setMessage("");
      textAreaRef.current?.focus()
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent default behavior and send the message
      e.preventDefault();
      handleSend();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      console.log("Shift + Enter pressed");
      // Allow new line when Shift + Enter is pressed
      setMessage((prev) => prev + "\n");
      console.log(message);
    }
  };

  return (
    <form
      className={`flex items-center gap-2 px-5 rounded-full ${styles}`}
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
    >
         <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full h-[40px] bg-transparent outline-none border-none text-white resize-none p-2 rounded-lg`}
        rows={3}
        disabled={disabled}
      />

      <button type="button" onClick={handleSend} disabled={disabled}>
        <SendHorizonal />
      </button>
    </form>
  );
}

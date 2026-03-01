"use client";

import { useState } from "react";

interface Message {
  sender: string;
  text: string;
}

const responses: Record<string, string> = {
  "what is this project":
    "This is a Hostel Management System built using Next.js, Express, MongoDB Atlas and JWT authentication.",

  "how does room allocation work":
    "Warden assigns rooms based on available capacity. Room occupancy is tracked automatically.",

  "how does fee tracking work":
    "Warden marks fee status as paid or unpaid after confirming payment in the college portal.",

  "student features":
    "Students can view profile, room details, fee status, and raise complaints.",

  "warden features":
    "Warden can manage rooms, students, complaints, and track fee status.",

  "tech stack":
    "Frontend: Next.js + Tailwind. Backend: Node.js + Express. Database: MongoDB Atlas. Authentication: JWT.",
  
  "how to login": "Use your email and password on the login page.",
  
  "how to register": "Click register on the login page and fill in your details.",
  
  "what is jwt": "JSON Web Tokens for secure authentication.",
  
  "database used": "MongoDB Atlas for cloud database storage.",
  
  "frontend framework": "Next.js with App Router for React-based UI.",
  
  "styling": "Tailwind CSS for responsive and modern design.",
  
  "deployment": "Can be deployed on Vercel for frontend and Railway/Heroku for backend."
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);

  setInput("");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: input })
  });

  const data = await res.json();

  const botMessage = {
    sender: "bot",
    text: data.reply || "Something went wrong"
  };

  setMessages((prev) => [...prev, botMessage]);
};

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="flex justify-between items-center bg-gray-700 text-white p-3 rounded-t-lg">
            <h3 className="font-semibold">Project Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-gray-900">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-white border border-gray-600 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex border-t border-gray-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 p-3 bg-gray-800 text-white border-none outline-none rounded-bl-lg placeholder-gray-400"
              placeholder="Ask something..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-br-lg transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

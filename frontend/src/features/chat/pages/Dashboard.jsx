import React from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useAuth} from "../../auth/hook/useAuth"
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";

const Dashboard = () => {
  const chat = useChat();
  const {handleLogout} = useAuth();
  const [chatInput, setChatInput] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const user = useSelector((state) => state.auth.user) 
  const [sidebarOpen, setSidebarOpen] = useState(false);
 

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const handleLogoutClick = async() => {
    await handleLogout();
    Navigate("/login");
  };

  const deleteChat = async(chatId) => {
    await chat.handleDeleteChat(chatId);
    chat.handleGetChats();
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <main className="min-h-screen w-full bg-[#e8d8b8] p-3 text-[#3b2f1f] md:p-5">
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed right-4 top-4 z-50 rounded-xl border border-[#b89c6a] bg-[#efe2c2] p-2 md:hidden"
      >
        <MenuIcon />
      </button>

      <section className="mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl border   p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1 border-none">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      
        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-[#b89c6a] bg-[#efe2c2] p-4 shadow-xl transition-transform duration-300 md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Paper-AI</h1>

            <button onClick={() => setSidebarOpen(false)} className="text-2xl">
              ✕
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto h-[65vh]">
            {Object.values(chats).map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between rounded-xl border border-[#b89c6a] px-3 py-2"
              >
                <button
                  className="flex-1 text-left"
                  onClick={() => {
                    openChat(chat.id);
                    setSidebarOpen(false);
                  }}
                >
                  {chat.title}
                </button>

                <IconButton onClick={() => deleteChat(chat.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="rounded-2xl border border-[#b89c6a] bg-[#f5ead1] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6a3d7a] text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold">{user?.username}</p>
                  <p className="truncate text-xs text-[#7a6a52]">
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogoutClick}
                className="mt-3 w-full rounded-xl border border-[#a14d3a] py-2 text-[#a14d3a]"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>
        <aside
          className="hidden h-full w-72 shrink-0 rounded-3xl border bg-[#efe2c2]
border-[#b89c6a] p-4 md:flex md:flex-col shadow-[0_12px_35px_rgba(0,0,0,0.22)]"
        >
          <h1 className="mb-5 text-5xl font-semibold tracking-tight">
            Paper-Ai
          </h1>

          <div className="flex-1 space-y-2 overflow-y-auto chats-scroll">
            {Object.values(chats).map((chat, index) => (
              <div
                key={index}
                className="group flex items-center justify-between rounded-xl border border-[#b89c6a] px-3 py-2 hover:bg-[#e7d3ad]"
              >
                <button
                  onClick={() => openChat(chat.id)}
                  type="button"
                  className="flex-1 text-left font-semibold text-[#4d3d28]"
                >
                  {chat.title}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("DELETE CLICKED", chat.id);
                    deleteChat(chat.id);
                  }}
                  className="hidden rounded p-1 text-red-500 hover:bg-brown-100 group-hover:block"
                >
                  <IconButton aria-label="delete" size="large">
                    <DeleteIcon />
                  </IconButton>
                </button>
              </div>
            ))}
          </div>
        </aside>
        <section className=" paper-bg relative flex h-full min-w-0 flex-1 flex-col gap-4 rounded-3xl border border-[#b89c6a] bg-[#f5ead1] p-6">
          <div className="messages flex-1 space-y-3 overflow-y-auto pr-1 pb-30">
            {chats[currentChatId]?.messages?.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] md:max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${
                  message.role === "user"
                    ? "ml-auto rounded-br-none bg-[#e3c89d] text-[#3b2f1f] shadow-md"
                    : "mr-auto border border-[#ccb58a] bg-[#f9f1df] text-[#3b2f1f] shadow-sm"
                }`}
              >
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-2 list-disc pl-5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-2 list-decimal pl-5">{children}</ol>
                      ),
                      code: ({ children }) => (
                        <code className="rounded bg-white/10 px-1 py-0.5">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">
                          {children}
                        </pre>
                      ),
                    }}
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <footer className="absolute bottom-2 left-2 right-2 rounded-3xl border border-[#b89c6a] bg-[#f8eed7] p-4">
            <form
              onSubmit={handleSubmitMessage}
              className="flex flex-col gap-3 md:flex-row"
            >
              <textarea
                rows={1}
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);

                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder="Ask anything..."
                className="max-h-52 min-h-[52px] w-full resize-none overflow-y-auto rounded-2xl border border-white/50 bg-transparent px-4 py-3 text-lg text-[#3b2f1f] outline-none placeholder:text-[#7a6a52]focus:border-white/90"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-2xl border border-[#b89c6a] bg-[#6f4e37] px-6 py-3 text-lg font-semibold text-[#f5ead1] transition hover:bg-[#5d3f2a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
        <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col">
          <div
            className="mt-auto h-full flex flex-col   justify-end   rounded-3xl border bg-[#efe2c2]
            border-[#b89c6a] p-5"
          >
            <div className="group relative flex items-center gap-3 rounded-2xl border border-[#b89c6a] bg-[#f5ead1] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6a3d7a] text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-semibold text-[#3b2f1f]">
                  {user?.username}
                </h3>

                <p className="truncate text-sm text-[#7a6a52]">{user?.email}</p>
              </div>

              <div className="absolute -top-12 left-0 hidden rounded-lg border border-[#b89c6a] bg-[#f5ead1] px-3 py-2 text-sm text-[#3b2f1f] shadow-lg group-hover:block">
                {user?.email}
              </div>
            </div>

            <button
              className="mt-5 w-full rounded-xl border border-[#a14d3a] py-3 text-[#a14d3a] hover:bg-[#e7d3ad]"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Dashboard;
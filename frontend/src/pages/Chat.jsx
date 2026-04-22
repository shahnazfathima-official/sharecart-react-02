import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import {
  Send,
  Phone,
  MessageSquare,
  Clock,
  ChevronLeft,
  MoreVertical,
  Paperclip,
  Smile,
} from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const { chats, sendMessage } = useProducts();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    sendMessage(selectedChat.id, {
      id: 'msg-' + Date.now(),
      senderId: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
    });
    setMessageText('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  // Chat List View
  if (!selectedChat) {
    return (
      <div className="pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white pt-8 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-indigo-100">
              Stay connected with buyers and sellers
            </p>
          </div>
        </div>

        {/* Chat List */}
        <div className="px-4 -mt-8">
          <div className="max-w-3xl mx-auto">
            {chats.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className="w-full p-4 flex items-center gap-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors text-left"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={chat.participantImage}
                        alt={chat.participantName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.participantName}
                        </h3>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start negotiating on products to begin chatting with sellers
                </p>
                <Button onClick={() => navigate('/products')}>
                  Browse Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Individual Chat View
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setSelectedChat(null)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <img
          src={selectedChat.participantImage}
          alt={selectedChat.participantName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{selectedChat.participantName}</h3>
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Online
          </p>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChat.messages.map((message, index) => {
          const isUser = message.senderId === 'user';
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-md'
                    : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    isUser ? 'text-indigo-200' : 'text-gray-400'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t border-gray-100 p-3 flex items-center gap-2"
      >
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
        />
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <Smile className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!messageText.trim()}
          className="p-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;

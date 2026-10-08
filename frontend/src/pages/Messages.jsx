import React, { useState, useRef, useEffect } from 'react';
import { useAuth, authUserToStudent } from '../context/AuthContext';
import { conversations as initialConvos } from '../data/mockData';
import { Avatar, SearchInput } from '../components/ui';
import { Send, Paperclip, Smile } from 'lucide-react';
export default function Messages({ navigate }) {
    const { user } = useAuth();
    const authStudent = user ? authUserToStudent(user) : null;
    const snehaConvo = initialConvos.find(convo => convo.with.name === 'Sneha Reddy');
    const openedConvo = snehaConvo
        ? { ...snehaConvo, unread: 0, messages: snehaConvo.messages.map(msg => ({ ...msg, read: true })) }
        : null;
    const [convos, setConvos] = useState(openedConvo ? [openedConvo] : []);
    const [activeConvo, setActiveConvo] = useState(openedConvo);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConvo]);
    function sendMessage() {
        if (!message.trim())
            return;
        const newMsg = {
            id: 'new-' + Date.now(),
            fromSelf: true,
            content: message,
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            read: true,
        };
        setConvos(cs => cs.map(c => c.id === activeConvo.id
            ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg, unread: 0 }
            : c));
        setActiveConvo(c => ({ ...c, messages: [...c.messages, newMsg], lastMessage: newMsg, unread: 0 }));
        setMessage('');
    }
    function openConvo(convo) {
        const readMessages = convo.messages.map(msg => ({ ...msg, read: true }));
        const readConvo = { ...convo, messages: readMessages, unread: 0 };
        setActiveConvo(readConvo);
        setConvos(cs => cs.map(c => c.id === convo.id ? readConvo : c));
    }
    const filtered = convos.filter(c => c.with.name.toLowerCase().includes(search.toLowerCase()));
    return (<div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Conversation list */}
      <div className="w-80 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-900 font-display mb-3">Messages</h2>
          <SearchInput value={search} onChange={setSearch} placeholder="Search conversations…"/>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(convo => {
            const active = convo.id === activeConvo.id;
            const lastIsMe = convo.lastMessage.fromSelf === true;
            return (<button key={convo.id} onClick={() => openConvo(convo)} className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors border-b border-slate-100 last:border-0 text-left ${active ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                <div className="relative shrink-0">
                  <Avatar student={convo.with} size="md"/>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-sm font-semibold truncate ${active ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {convo.with.name}
                    </p>
                    <p className="text-xs text-slate-400 shrink-0 ml-2">{convo.lastMessage.timestamp}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${convo.unread > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                      {lastIsMe ? 'You: ' : ''}{convo.lastMessage.content}
                    </p>
                    {convo.unread > 0 && (<span className="ml-2 shrink-0 w-5 h-5 bg-indigo-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                        {convo.unread}
                      </span>)}
                  </div>
                </div>
              </button>);
        })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar student={activeConvo.with} size="md"/>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"/>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{activeConvo.with.name}</h3>
              <p className="text-xs text-slate-500">{activeConvo.with.branch} · Year {activeConvo.with.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('profile', { studentId: activeConvo.with.id, sidebarPage: 'messages', returnPage: 'messages' })} className="px-3 h-8 text-sm text-indigo-600 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
              View Profile
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50">
          {activeConvo.messages.map((msg, i) => {
            const isMe = msg.fromSelf === true;
            const prevMsg = activeConvo.messages[i - 1];
            const showAvatar = !isMe && (i === 0 || prevMsg?.fromSelf === true || prevMsg?.from?.id !== msg.from?.id);
            const msgStudent = isMe ? authStudent : msg.from;
            return (<div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && (showAvatar && msgStudent
                    ? <Avatar student={msgStudent} size="sm" className="shrink-0"/>
                    : <div className="w-8 shrink-0"/>)}
                <div className={`max-w-md flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-bl-sm'}`}>
                    {msg.content}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 px-1">{msg.timestamp}</p>
                </div>
              </div>);
        })}
          <div ref={messagesEndRef}/>
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
              <Paperclip className="w-5 h-5"/>
            </button>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    } }} placeholder={`Message ${activeConvo.with.name.split(' ')[0]}…`} className="flex-1 h-10 rounded-xl border border-slate-300 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 transition-colors"/>
            <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
              <Smile className="w-5 h-5"/>
            </button>
            <button onClick={sendMessage} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${message.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              <Send className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>
    </div>);
}

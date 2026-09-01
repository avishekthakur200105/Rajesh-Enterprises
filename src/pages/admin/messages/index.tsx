import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Trash2, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) return;
      const { data } = await supabase.from('categories').select('*').eq('slug', '_contact_messages_').single();
      if (data && data.description) {
        try {
          const parsed = JSON.parse(data.description);
          if (Array.isArray(parsed)) {
            setMessages(parsed);
          }
        } catch (e) {}
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const newMessages = messages.filter(m => m.id !== id);
      
      const { data } = await supabase.from('categories').select('id').eq('slug', '_contact_messages_').single();
      if (data && data.id) {
        await supabase.from('categories').update({
          description: JSON.stringify(newMessages)
        }).eq('id', data.id);
        
        setMessages(newMessages);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete. Check console.");
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800 flex items-center">
          <MessageSquare className="h-6 w-6 mr-3 text-green-600" /> 
          Contact Messages
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            No messages found. When customers use the Contact Us form, their messages will appear here.
          </div>
        ) : (
          <ul className="divide-y divide-stone-200">
            {messages.map((msg) => (
              <li key={msg.id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-sm font-medium text-green-600 hover:underline">{msg.email}</a>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                      {new Date(msg.date).toLocaleString()}
                    </span>
                    <button 
                      onClick={() => setItemToDelete(msg.id)} 
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 bg-stone-50 p-4 rounded-md border border-stone-100 text-stone-700 whitespace-pre-wrap">
                  {msg.message}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-2">Confirm Deletion</h3>
            <p className="text-stone-600 mb-6 text-sm">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors text-sm">Cancel</button>
              <button onClick={() => { deleteMessage(itemToDelete); setItemToDelete(null); }} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useSettingsStore } from '../../store/settings';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Contact() {
  const { settings } = useSettingsStore();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setStatus('error');
        return;
      }
      
      const { data: existingData } = await supabase.from('categories').select('*').eq('slug', '_contact_messages_').single();
      
      const newMessage = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        message: formData.message,
        date: new Date().toISOString()
      };

      let messages = [];
      if (existingData && existingData.description) {
        try {
          messages = JSON.parse(existingData.description);
          if (!Array.isArray(messages)) messages = [];
        } catch (e) {}
      }

      messages.unshift(newMessage);

      const payload = {
        name: 'Contact Messages',
        slug: '_contact_messages_',
        description: JSON.stringify(messages),
        is_active: false
      };

      if (existingData && existingData.id) {
        await supabase.from('categories').update(payload).eq('id', existingData.id);
      } else {
        await supabase.from('categories').insert([payload]);
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight mb-8">Contact Us</h1>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Get in Touch</h2>
              <div className="space-y-4 text-stone-600">
                <p><strong>Address:</strong><br />{settings.address}</p>
                <p><strong>Phone:</strong><br />{settings.phone}</p>
                <p><strong>Email:</strong><br />{settings.email}</p>
                <p><strong>Business Hours:</strong><br />Sunday - Friday: 9:00 AM - 6:00 PM<br />Saturday: Closed</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Send a Message</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {status === 'success' && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm border border-green-200">
                    Your message has been sent successfully. We will get back to you soon!
                  </div>
                )}
                {status === 'error' && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-200">
                    Failed to send message. Please try again.
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea required rows={4} name="message" value={formData.message} onChange={handleInputChange} className="w-full border-stone-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
                </div>
                <button disabled={status === 'submitting'} type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
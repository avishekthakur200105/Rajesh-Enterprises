import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Sprout } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
         setError("Supabase is not configured correctly. Please check the URL in Settings..");
         setLoading(false);
         return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            email: email, // Store email in profiles too
          }
        }
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      console.error("SignUp error:", err); setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-stone-100 text-center">
          <div className="bg-green-100 p-4 rounded-full inline-flex mb-4 text-green-700">
            <Sprout className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Registration Successful!</h2>
          <p className="text-stone-600 mb-6">Please check your email to verify your account, or log in if email verification is disabled.</p>
          <p className="text-sm text-stone-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-stone-100">
        <div className="flex flex-col items-center">
          <div className="bg-green-50 p-3 rounded-full mb-4">
             <Sprout className="h-10 w-10 text-green-700" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-stone-900">Create an account</h2>
          <p className="mt-2 text-center text-sm text-stone-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-700 hover:text-green-600 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1" htmlFor="full-name">Full Name</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Ram Bahadur"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1" htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

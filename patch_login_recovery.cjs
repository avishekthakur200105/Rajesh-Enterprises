const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Login.tsx', 'utf8');

const importSearch = "import { useState } from 'react';\nimport { Link, useNavigate } from 'react-router-dom';";
const importReplace = "import { useState, useEffect } from 'react';\nimport { Link, useNavigate, useLocation } from 'react-router-dom';";

code = code.replace(importSearch, importReplace);

const stateSearch = `  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);`;
  
const stateReplace = `  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Check if URL contains recovery tokens (from Supabase email link)
    if (location.hash && location.hash.includes('type=recovery')) {
      setIsRecoveryMode(true);
    }
  }, [location.hash]);`;

code = code.replace(stateSearch, stateReplace);

const resetHandleSearch = `  const handleResetPassword = async (e: React.FormEvent) => {`;
const resetHandleReplace = `  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      // Success - redirect to home or admin based on user
      setIsRecoveryMode(false);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {`;

code = code.replace(resetHandleSearch, resetHandleReplace);

const formSearch = `        {isForgotPassword ? (`;
const formReplace = `        {isRecoveryMode ? (
          <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
            <div className="text-center">
              <h3 className="text-lg font-medium text-stone-900">Set New Password</h3>
              <p className="mt-1 text-sm text-stone-500">Please enter your new password below.</p>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1" htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        ) : isForgotPassword ? (`;

code = code.replace(formSearch, formReplace);

fs.writeFileSync('src/pages/storefront/Login.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/Login.tsx', 'utf8');

const searchState = `  const [error, setError] = useState<string | null>(null);`;
const replaceState = `  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);`;

code = code.replace(searchState, replaceState);

const searchHandleLogin = `  const handleLogin = async (e: React.FormEvent) => {`;
const replaceHandleLogin = `  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {`;

code = code.replace(searchHandleLogin, replaceHandleLogin);

const searchForm = `        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}`;

const replaceForm = `        {isForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}
            {resetSent && (
              <div className="bg-green-50 text-green-700 p-3 rounded text-sm text-center">
                Password reset link has been sent to your email.
              </div>
            )}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1" htmlFor="reset-email">Email address</label>
                <input
                  id="reset-email"
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
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={loading || resetSent}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setError(null); setResetSent(false); }}
                className="w-full flex justify-center py-3 px-4 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Back to sign in
              </button>
            </div>
          </form>
        ) : (
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}`;

code = code.replace(searchForm, replaceForm);

const searchForgotBtn = `            <div className="text-sm">
              <a href="#" className="font-medium text-green-700 hover:text-green-600 transition-colors">
                Forgot your password?
              </a>
            </div>`;

const replaceForgotBtn = `            <div className="text-sm">
              <button 
                type="button"
                onClick={() => { setIsForgotPassword(true); setError(null); }}
                className="font-medium text-green-700 hover:text-green-600 transition-colors"
              >
                Forgot your password?
              </button>
            </div>`;

code = code.replace(searchForgotBtn, replaceForgotBtn);

const searchClosingForm = `          </div>
        </form>
      </div>`;

const replaceClosingForm = `          </div>
        </form>
        )}
      </div>`;

code = code.replace(searchClosingForm, replaceClosingForm);

fs.writeFileSync('src/pages/storefront/Login.tsx', code);

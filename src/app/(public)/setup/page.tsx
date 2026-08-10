'use client';

import { useEffect, useState } from 'react';

export default function SetupPage() {
  const [sql, setSql] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/admin/migrations-sql')
      .then(r => r.json())
      .then(d => setSql(d.sql));
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">🚀 Database Setup</h1>
          <p className="text-slate-600 mb-8">Initialize your PrestaCerto database in 2 minutes</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-900 font-semibold mb-2">ℹ️ How it works:</p>
            <ol className="text-blue-800 space-y-1 ml-4 list-decimal">
              <li>Click the button below to copy all SQL</li>
              <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="underline font-semibold">Supabase Dashboard</a></li>
              <li>Select project <code className="bg-white px-2 py-1 rounded">taktwwwpcyxhyylzmgho</code></li>
              <li>Go to <code className="bg-white px-2 py-1 rounded">SQL Editor</code></li>
              <li>Create new query and paste the SQL</li>
              <li>Click <code className="bg-white px-2 py-1 rounded">Run</code></li>
            </ol>
          </div>

          <div className="mb-6">
            <button
              onClick={copy}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? '✅ Copied to Clipboard!' : '📋 Copy SQL'}
            </button>
          </div>

          <textarea
            value={sql}
            readOnly
            className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm text-slate-700 bg-slate-50"
          />

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-slate-600 text-sm">
              ⏱️ <strong>Time needed:</strong> 2 minutes<br/>
              ✅ <strong>After running:</strong> Login will work, all 10 new features ready to build
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

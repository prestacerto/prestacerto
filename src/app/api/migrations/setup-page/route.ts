import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  try {
    // Read SQL files from migrations folder
    const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
    const sqlFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.match(/^000\d_init\.sql$/));

    let sql = "";
    if (sqlFiles.length > 0) {
      sql = fs.readFileSync(path.join(migrationsDir, sqlFiles[0]), "utf-8");
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PrestaCerto — Database Setup</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); min-height: 100vh; padding: 40px 20px; }
    .container { max-width: 900px; margin: 0 auto; }
    .card { background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 40px; }
    h1 { font-size: 36px; color: #1f2937; margin-bottom: 10px; }
    .subtitle { color: #6b7280; margin-bottom: 30px; }
    .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
    .info-box h3 { color: #1e40af; margin-bottom: 15px; }
    .info-box ol { margin-left: 20px; color: #1e40af; line-height: 1.8; }
    .info-box li { margin-bottom: 8px; }
    .info-box code { background: white; padding: 2px 8px; border-radius: 4px; font-family: monospace; }
    .button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.2s; }
    .button:hover { background: #2563eb; }
    .button.success { background: #10b981; }
    textarea { width: 100%; height: 400px; padding: 16px; border: 1px solid #d1d5db; border-radius: 8px; font-family: monospace; font-size: 13px; resize: vertical; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>🚀 PrestaCerto Database Setup</h1>
      <p class="subtitle">Activate your database in 2 minutes</p>

      <div class="info-box">
        <h3>ℹ️ Setup Instructions:</h3>
        <ol>
          <li>Click <strong>"Copy SQL"</strong> below</li>
          <li>Go to <a href="https://supabase.com/dashboard" target="_blank" style="color: #1e40af; text-decoration: underline;">Supabase Dashboard</a></li>
          <li>Select your project</li>
          <li>Open <strong>SQL Editor</strong></li>
          <li>Create new query and paste</li>
          <li>Click <strong>Run</strong></li>
        </ol>
      </div>

      <button class="button" onclick="copySql()">📋 Copy SQL</button>

      <textarea id="sql" readonly></textarea>

      <div class="footer">
        ⏱️ <strong>2 minutes</strong> | ✅ <strong>After:</strong> Login enabled + all features ready
      </div>
    </div>
  </div>

  <script>
    function copySql() {
      const textarea = document.getElementById('sql');
      textarea.select();
      document.execCommand('copy');
      alert('✅ SQL copied!\\nPaste in Supabase Console > SQL Editor > Run');
    }

    // Fetch SQL from API
    fetch('/api/migrations/sql-content')
      .then(r => r.json())
      .then(d => { document.getElementById('sql').value = d.sql; })
      .catch(() => { document.getElementById('sql').value = 'Failed to load SQL'; });
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    return new NextResponse("Error loading setup page", { status: 500 });
  }
}

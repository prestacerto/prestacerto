"use client";

export default function LoginDirect() {
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;

    console.log("Attempting login...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.error) {
        alert("❌ Erro: " + data.error);
      } else if (data.user) {
        alert("✅ Login bem-sucedido!");
        localStorage.setItem("supabase.auth.token", data.access_token);
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      alert("❌ Erro: " + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🔐 Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            defaultValue="finaltest@prestacerto.com.br"
            style={{ width: "100%", padding: "8px", marginTop: "5px", boxSizing: "border-box" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            defaultValue="Test123456!"
            style={{ width: "100%", padding: "8px", marginTop: "5px", boxSizing: "border-box" }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

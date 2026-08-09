import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "test-key");

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Se RESEND_API_KEY for placeholder, retorna sucesso fake pra teste
    if (process.env.RESEND_API_KEY === "your_resend_key_here") {
      console.log(`[TEST MODE] Email enviado pra ${email}:`, {
        to: email,
        subject: `Bem-vindo ao PrestaCerto, ${name || "usuário"}!`,
        html: `<h1>Bem-vindo!</h1><p>Obrigado por se cadastrar.</p>`,
      });

      return NextResponse.json({
        success: true,
        mode: "test",
        message: `Email de teste enviado pra ${email} (modo mock)`,
      });
    }

    // Modo real: usa Resend
    const result = await resend.emails.send({
      from: "noreply@prestacerto.com.br",
      to: email,
      subject: `Bem-vindo ao PrestaCerto, ${name || "usuário"}!`,
      html: `
        <h1>Bem-vindo ao PrestaCerto! 🚀</h1>
        <p>Oi ${name || "usuário"},</p>
        <p>Obrigado por se cadastrar na PrestaCerto!</p>
        <p>Sua conta foi criada com sucesso. Você já pode:</p>
        <ul>
          <li>Explorar freelancers e projetos</li>
          <li>Criar sua primeiro serviço</li>
          <li>Ganhar com indicações</li>
        </ul>
        <p><strong>Contrate talentos. Sem comissões.</strong></p>
      `,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: "production",
      messageId: result.data?.id,
      message: `Email enviado pra ${email}`,
    });
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      { error: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}

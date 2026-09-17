"use client";

import { useState } from "react";
import { Shield, Check, AlertCircle, Phone, Mail } from "lucide-react";

export interface VerificationStatus {
  cpf: boolean;
  email: boolean;
  phone: boolean;
  linkedin: boolean;
}

export function IdentityVerification() {
  const [status, setStatus] = useState<VerificationStatus>({
    cpf: false,
    email: true,
    phone: false,
    linkedin: false,
  });

  const [cpfInput, setCpfInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const handleVerifyCPF = async () => {
    setLoading(true);
    // TODO: Call /api/verify/cpf with cpfInput
    setTimeout(() => {
      setStatus({ ...status, cpf: true });
      setLoading(false);
      setCpfInput("");
    }, 1500);
  };

  const handleVerifyPhone = async () => {
    setLoading(true);
    // TODO: Call /api/verify/phone with phoneInput
    setTimeout(() => {
      setStatus({ ...status, phone: true });
      setLoading(false);
      setPhoneInput("");
    }, 1500);
  };

  const handleVerifyLinkedIn = async () => {
    setLoading(true);
    // TODO: Call /api/verify/linkedin with linkedinUrl
    setTimeout(() => {
      setStatus({ ...status, linkedin: true });
      setLoading(false);
      setLinkedinUrl("");
    }, 1500);
  };

  const verificationScore = Object.values(status).filter(Boolean).length;

  const verifications = [
    {
      key: "cpf" as const,
      label: "CPF",
      icon: "🆔",
      description: "Validação oficial de identidade",
      value: cpfInput,
      setValue: setCpfInput,
      format: formatCPF,
      placeholder: "000.000.000-00",
      handleVerify: handleVerifyCPF,
      price: 19,
    },
    {
      key: "phone" as const,
      label: "Telefone",
      icon: "📱",
      description: "Confirmação via SMS",
      value: phoneInput,
      setValue: setPhoneInput,
      format: formatPhone,
      placeholder: "(00) 0000-0000",
      handleVerify: handleVerifyPhone,
      price: 0,
    },
    {
      key: "email" as const,
      label: "Email",
      icon: "✉️",
      description: "Já verificado",
      value: "",
      setValue: () => {},
      format: (v: string) => v,
      placeholder: "",
      handleVerify: () => {},
      price: 0,
    },
    {
      key: "linkedin" as const,
      label: "LinkedIn",
      icon: "💼",
      description: "Conectar perfil profissional",
      value: linkedinUrl,
      setValue: setLinkedinUrl,
      format: (v: string) => v,
      placeholder: "https://linkedin.com/in/seu-perfil",
      handleVerify: handleVerifyLinkedIn,
      price: 0,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          🛡️ Verificação de Identidade
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Aumente sua confiança e ganhe mais propostas com verificações
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Perfil Verificado</p>
            <p className="text-4xl font-bold">{verificationScore}/4</p>
          </div>
          <div className="text-6xl">
            {verificationScore === 4
              ? "⭐"
              : verificationScore >= 2
                ? "✅"
                : "⚠️"}
          </div>
        </div>
      </div>

      {/* Verification Items */}
      <div className="space-y-4 mb-8">
        {verifications.map((verification) => (
          <div
            key={verification.key}
            className={`p-4 rounded-lg border-2 transition-all ${
              status[verification.key]
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{verification.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {verification.label}
                    {status[verification.key] && (
                      <span className="text-green-600">✓</span>
                    )}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {verification.description}
                  </p>
                </div>
              </div>
              {verification.price > 0 && !status[verification.key] && (
                <p className="text-sm font-semibold text-blue-600">
                  R$ {verification.price}
                </p>
              )}
            </div>

            {!status[verification.key] && verification.key !== "email" && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verification.value}
                  onChange={(e) =>
                    verification.setValue(verification.format(e.target.value))
                  }
                  placeholder={verification.placeholder}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={verification.handleVerify}
                  disabled={loading || !verification.value}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white text-sm font-semibold transition-colors"
                >
                  {loading ? "..." : "Verificar"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">
          ✨ Benefícios da Verificação
        </h3>
        <ul className="space-y-2">
          <li className="flex gap-2 text-slate-700 dark:text-slate-300">
            <Check className="size-5 text-green-600 flex-shrink-0" />
            <span>Badge de verificação no seu perfil</span>
          </li>
          <li className="flex gap-2 text-slate-700 dark:text-slate-300">
            <Check className="size-5 text-green-600 flex-shrink-0" />
            <span>+25% de confiança para clientes</span>
          </li>
          <li className="flex gap-2 text-slate-700 dark:text-slate-300">
            <Check className="size-5 text-green-600 flex-shrink-0" />
            <span>Mais visibilidade em buscas</span>
          </li>
          <li className="flex gap-2 text-slate-700 dark:text-slate-300">
            <Check className="size-5 text-green-600 flex-shrink-0" />
            <span>Acesso a projetos premium</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Badge component to show on freelancer profile
export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const verifiedCount = Object.values(status).filter(Boolean).length;

  if (verifiedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950">
      <Shield className="size-4 text-green-600" />
      <span className="text-xs font-semibold text-green-700 dark:text-green-300">
        {verifiedCount === 4 ? "Completamente Verificado" : `${verifiedCount} verificações`}
      </span>
    </div>
  );
}

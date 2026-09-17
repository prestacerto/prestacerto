"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Shield, Building2 } from "lucide-react";

interface CompanyVerificationModalProps {
  currentStatus?: "verified" | "pending" | null;
}

export function CompanyVerificationModal({
  currentStatus,
}: CompanyVerificationModalProps) {
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 14);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8)
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(
      5,
      8
    )}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  };

  const handleVerify = async () => {
    if (cnpj.replace(/\D/g, "").length !== 14) {
      setError("CNPJ deve ter 14 dígitos");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/verification/validate-cnpj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cnpj: cnpj.replace(/\D/g, ""),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "CNPJ não encontrado na Receita Federal"
        );
      }

      const data = await response.json();

      // Iniciar checkout Mercado Pago
      const mpResponse = await fetch(
        "/api/monetization/company-verification/purchase",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: 9.9,
            companyName: data.company_name,
            cnpj: cnpj.replace(/\D/g, ""),
          }),
        }
      );

      if (!mpResponse.ok) throw new Error("Erro ao processar pagamento");

      const { preferenceId } = await mpResponse.json();
      // @ts-expect-error — window.mp vem do script global do Mercado Pago, sem tipos
      if (window.mp) {
        // @ts-expect-error — window.mp vem do script global do Mercado Pago, sem tipos
        window.mp.checkout({ preference: preferenceId });
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na verificação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          Verificação de Empresa
        </h2>
        <p className="text-slate-500 mt-1">
          Aumente a confiança com clientes — valide seu CNPJ junto à Receita
          Federal
        </p>
      </div>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 flex gap-3">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">
              Empresas verificadas recebem mais contatos
            </p>
            <p className="text-blue-800 text-xs mt-1">
              Seu selo aparece no perfil e aumenta credibilidade com clientes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      {currentStatus === "verified" && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 flex gap-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-green-900">
                ✓ Sua empresa está verificada!
              </p>
              <p className="text-green-800 text-xs mt-1">
                Seu selo &quot;Empresa Verificada&quot; está ativo e visível no seu
                perfil.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {currentStatus !== "verified" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Insira seu CNPJ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 flex gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700 flex gap-2">
                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
                Verificação bem-sucedida! Proceda ao pagamento.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                CNPJ (formato: XX.XXX.XXX/XXXX-XX)
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => {
                  setCnpj(formatCNPJ(e.target.value));
                  setError(null);
                }}
                placeholder="00.000.000/0000-00"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={18}
              />
              <p className="text-xs text-slate-500 mt-1">
                Será validado junto à Receita Federal de forma segura
              </p>
            </div>

            <Button
              onClick={handleVerify}
              disabled={loading || cnpj.replace(/\D/g, "").length !== 14}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? "Verificando..." : "Verificar CNPJ"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Benefícios do Selo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Selo de verificação no seu perfil</span>
          </div>
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Maior confiança de clientes</span>
          </div>
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Validade de 1 ano</span>
          </div>
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Renovação automática</span>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      {currentStatus !== "verified" && (
        <Card className="border-2 border-blue-600 bg-blue-50">
          <CardContent className="pt-6">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Tipo:</span>
                <span className="font-bold">Selo Empresa Verificada</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Validade:</span>
                <span className="font-bold">1 ano</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-slate-600">Total:</span>
                <span className="text-2xl font-bold">R$ 9.90</span>
              </div>
            </div>
            <Button
              onClick={handleVerify}
              disabled={loading || cnpj.replace(/\D/g, "").length !== 14}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? "Processando..." : "Continuar"}
            </Button>
            <p className="text-xs text-slate-500 text-center mt-3">
              Renovação automática. Cancele quando quiser.
            </p>
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-slate-900">Meu CNPJ é seguro?</p>
          <p className="text-slate-500 mt-1">
            Sim! Apenas validamos com a Receita Federal. Seu CNPJ não é
            armazenado.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Quanto tempo leva?</p>
          <p className="text-slate-500 mt-1">
            Verificação é instantânea. Selo ativo em segundos.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">E se der erro?</p>
          <p className="text-slate-500 mt-1">
            Verifique se o CNPJ está ativo na Receita Federal e tente
            novamente.
          </p>
        </div>
      </div>
    </div>
  );
}

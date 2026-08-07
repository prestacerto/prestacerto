"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AvatarUpload } from "./avatar-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileEditFormProps {
  userId: string;
  initialData: {
    full_name: string;
    headline: string | null;
    bio: string | null;
    city: string | null;
    state: string | null;
    avatar_url: string | null;
    resume_url: string | null;
  };
}

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export function ProfileEditForm({ userId, initialData }: ProfileEditFormProps) {
  const router = useRouter();
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(initialData.full_name);
  const [headline, setHeadline] = useState(initialData.headline ?? "");
  const [bio, setBio] = useState(initialData.bio ?? "");
  const [city, setCity] = useState(initialData.city ?? "");
  const [state, setState] = useState(initialData.state ?? "");
  const [resumeUrl, setResumeUrl] = useState(initialData.resume_url ?? "");
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleResumeUpload(file: File) {
    if (file.type !== "application/pdf") {
      toast.error("Envie um arquivo PDF.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("PDF muito grande. Máximo 8MB.");
      return;
    }

    setUploadingResume(true);
    try {
      const supabase = createClient();
      const path = `${userId}/curriculo.pdf`;

      const { error } = await supabase.storage
        .from("resumes")
        .upload(path, file, { cacheControl: "3600", upsert: true, contentType: "application/pdf" });

      if (error) throw error;

      const { data } = supabase.storage.from("resumes").getPublicUrl(path);
      setResumeUrl(data.publicUrl);
      setResumeName(file.name);
      toast.success("Currículo enviado!");
    } catch (err) {
      console.error("Resume upload falhou:", err);
      toast.error("Não foi possível enviar o currículo.");
    } finally {
      setUploadingResume(false);
    }
  }

  async function handleSave() {
    if (!fullName.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          headline: headline.trim() || undefined,
          bio: bio.trim() || undefined,
          city: city.trim() || undefined,
          state: state || undefined,
          resume_url: resumeUrl || undefined,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Perfil salvo!");
      router.refresh();
    } catch {
      toast.error("Não foi possível salvar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <AvatarUpload
          userId={userId}
          currentUrl={initialData.avatar_url}
          fullName={fullName || "?"}
          onUploaded={() => router.refresh()}
        />
      </div>

      {/* Nome + Headline */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Nome completo</Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Seu nome"
            maxLength={80}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="headline">Título profissional</Label>
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Ex: Designer UX/UI • São Paulo"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground">
            {headline.length}/100 — aparece logo abaixo do seu nome no perfil
          </p>
        </div>
      </div>

      {/* Localização */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="São Paulo"
            maxLength={80}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="state">Estado</Label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          >
            <option value="">Selecione</option>
            {ESTADOS_BR.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio">Sobre você</Label>
        <Textarea
          id="bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Conte quem você é, sua experiência e o que você faz de melhor. Seja direto e autêntico."
          maxLength={600}
        />
        <p className="text-xs text-muted-foreground">{bio.length}/600</p>
      </div>

      {/* Currículo */}
      <div className="space-y-2">
        <Label>Currículo (PDF)</Label>
        {resumeUrl ? (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950">
            <FileText className="size-4 text-green-700 dark:text-green-400 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-sm text-green-800 dark:text-green-300">
              {resumeName ?? "Currículo enviado"}
            </span>
            <button
              type="button"
              onClick={() => { setResumeUrl(""); setResumeName(null); }}
              className="text-green-700 hover:text-red-600 dark:text-green-400"
              aria-label="Remover currículo"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => resumeInputRef.current?.click()}
            disabled={uploadingResume}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-4 text-sm text-muted-foreground transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-600 disabled:cursor-not-allowed"
          >
            <Upload className="size-4" />
            {uploadingResume ? "Enviando..." : "Clique pra enviar seu currículo em PDF"}
          </button>
        )}
        <input
          ref={resumeInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleResumeUpload(f);
            e.target.value = "";
          }}
        />
        <p className="text-xs text-muted-foreground">
          Aparece no seu perfil público como botão "Baixar currículo". Máximo 8MB.
        </p>
      </div>

      <Button type="button" nativeButton disabled={saving} onClick={handleSave} className="w-full sm:w-auto">
        {saving ? "Salvando..." : "Salvar perfil"}
      </Button>
    </div>
  );
}

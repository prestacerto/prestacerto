"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_MB = 3;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface AvatarUploadProps {
  userId: string;
  currentUrl: string | null;
  fullName: string;
  onUploaded: (url: string) => void;
}

export function AvatarUpload({ userId, currentUrl, fullName, onUploaded }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Imagem muito grande. Máximo ${MAX_MB}MB.`);
      return;
    }

    setUploading(true);
    try {
      const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
      const path = `${userId}/avatar.${ext}`;
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      // Quebra cache do browser adicionando timestamp
      const url = `${data.publicUrl}?t=${Date.now()}`;

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: data.publicUrl }),
      });
      if (!res.ok) throw new Error("Falha ao salvar URL");

      setPreview(url);
      onUploaded(data.publicUrl);
      toast.success("Foto atualizada!");
    } catch (err) {
      console.error("Avatar upload falhou:", err);
      toast.error("Não foi possível enviar a foto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative size-24 overflow-hidden rounded-full border-2 border-dashed border-slate-300 transition hover:border-blue-400 dark:border-slate-600"
        aria-label="Alterar foto de perfil"
      >
        {preview ? (
          <Image
            src={preview}
            alt={fullName}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="flex size-full items-center justify-center bg-slate-900 text-2xl font-semibold text-white">
            {fullName.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
          <Camera className="size-6 text-white" />
        </div>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </button>
      <p className="text-xs text-muted-foreground">Clique pra trocar a foto</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

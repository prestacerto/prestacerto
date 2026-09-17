"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PortfolioItemUpload({ userId }: { userId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      toast.error("Formato não aceito. Use JPG, PNG ou WebP.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Imagem muito grande. Máximo ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleUpload() {
    if (!file || !title.trim()) {
      toast.error("Escolha uma imagem e escreva um título");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(path);

      const res = await fetch("/api/portfolio-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: publicUrlData.publicUrl,
          title,
          description: description || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Falha ao salvar");
      }

      toast.success("Trabalho adicionado ao portfólio!");
      setFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");
      router.refresh();
    } catch (error) {
      console.error("Portfolio upload falhou:", error);
      toast.error("Não foi possível enviar a imagem", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="portfolio-image">Imagem do trabalho</Label>
          <div className="mt-1.5 flex items-center gap-4">
            {preview ? (
              <div className="relative size-24 overflow-hidden rounded-lg border">
                <Image src={preview} alt="Pré-visualização" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex size-24 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <Upload className="size-6" />
              </div>
            )}
            <Input
              id="portfolio-image"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={handleFileChange}
              className="max-w-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="portfolio-title">Título do trabalho</Label>
          <Input
            id="portfolio-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Identidade visual pra loja de roupas"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="portfolio-description">Descrição (opcional)</Label>
          <Textarea
            id="portfolio-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Conte rapidamente sobre o projeto"
          />
        </div>

        <Button type="button" nativeButton disabled={uploading} onClick={handleUpload}>
          {uploading ? "Enviando..." : "Adicionar ao portfólio"}
        </Button>
      </CardContent>
    </Card>
  );
}

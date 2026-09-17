"use client";

import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";

interface Contact {
  contact_email: string | null;
  contact_phone: string | null;
}

export function ContactReveal({ projectId }: { projectId: string }) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/project-contact/${projectId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setContact)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading || !contact || (!contact.contact_email && !contact.contact_phone)) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg bg-emerald-50 p-4">
      <p className="text-sm font-semibold text-emerald-800">
        Sua proposta foi aceita — aqui está o contato direto do cliente:
      </p>
      <div className="mt-2 space-y-1">
        {contact.contact_email && (
          <a
            href={`mailto:${contact.contact_email}`}
            className="flex items-center gap-2 text-sm text-emerald-700 hover:underline"
          >
            <Mail className="size-4" />
            {contact.contact_email}
          </a>
        )}
        {contact.contact_phone && (
          <a
            href={`tel:${contact.contact_phone}`}
            className="flex items-center gap-2 text-sm text-emerald-700 hover:underline"
          >
            <Phone className="size-4" />
            {contact.contact_phone}
          </a>
        )}
      </div>
    </div>
  );
}

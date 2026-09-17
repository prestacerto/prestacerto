import { permanentRedirect } from 'next/navigation';
export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  permanentRedirect(`/perfil/${encodeURIComponent(id)}`);
}

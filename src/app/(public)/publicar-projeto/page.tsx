import { PublishProjectForm } from '@/components/projects/publish-project-form';
import { getAuthenticatedUser, getProfile } from '@/lib/auth/getUser';
import { getNoIndexMetadata } from '@/lib/seo/metadata';
export const metadata = getNoIndexMetadata('Publicar projeto grátis', 'Descreva o serviço, revise escopo, orçamento e prazo e publique gratuitamente no PrestaCerto. Seu rascunho fica salvo neste navegador.');
export default async function PublishProjectPage() {
  const [user, profile] = await Promise.all([getAuthenticatedUser(), getProfile()]);
  return <PublishProjectForm userId={user?.id} userEmail={user?.email} role={profile?.role} />;
}

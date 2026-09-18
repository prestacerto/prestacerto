import { redirect } from 'next/navigation';

export default async function SignoutPage(props: { searchParams: Promise<{ return_to?: string }> }) {
  const searchParams = await props.searchParams;
  const returnTo = searchParams.return_to || '/';

  redirect(returnTo);
}

import { notFound } from "next/navigation";

/** Database setup belongs to the deployment runbook, never to the public app. */
export default function SetupPage() {
  notFound();
}

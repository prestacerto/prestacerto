import { notFound } from "next/navigation";

/** Development-only login shortcut intentionally unavailable in production. */
export default function LoginDirect() {
  notFound();
}

import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

// Nur die Startseite: im Layout würde der Canonical auch für /brand gelten.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Page() {
  return <HomePage />;
}

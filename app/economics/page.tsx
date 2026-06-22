import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Access Redirect",
  alternates: {
    canonical: "/access",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function EconomicsRedirectPage() {
  redirect("/access");
}

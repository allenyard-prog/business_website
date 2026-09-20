import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "U.S. Hosting Equipment Manager | Wonderhow Careers",
  description: "Join Wonderhow as a U.S.-based hosting equipment manager and real-time technical support partner.",
};

export default function CareersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

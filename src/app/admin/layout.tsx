import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin | Wonderhow", robots: { index: false, follow: false } };

const links = [
  ["Overview", "/admin"],
  ["Job posts", "/admin/jobs"],
  ["Applications", "/admin/applications"],
  ["Resource types", "/admin/resource-types"],
  ["Resources", "/admin/resources"],
];

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-shell"><aside className="admin-sidebar"><Link className="admin-brand" href="/"><span>W</span> Wonderhow</Link><p>Administration</p><nav>{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav><div className="admin-sidebar-foot"><Link href="/careers">View careers ↗</Link><small>Protected workspace</small></div></aside><div className="admin-content"><header className="admin-topbar"><div><span>Wonderhow</span><b>Content &amp; recruitment</b></div><Link href="/">Public website ↗</Link></header>{children}</div></div>;
}

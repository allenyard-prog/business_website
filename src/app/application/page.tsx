import { redirect } from "next/navigation";

export default function LegacyApplicationPage() {
  redirect("/admin/applications");
}

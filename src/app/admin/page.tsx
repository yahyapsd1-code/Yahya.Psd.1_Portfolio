import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getSiteContent,
  getAdminPortfolio,
  getAdminTestimonials,
  getMessages,
} from "@/lib/content";
import { Dashboard } from "@/components/admin/Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [content, portfolio, testimonials, messages] = await Promise.all([
    getSiteContent(),
    getAdminPortfolio(),
    getAdminTestimonials(),
    getMessages(),
  ]);

  return (
    <Dashboard
      initial={{
        content,
        portfolio,
        testimonials,
        messages,
        name: session.name,
        email: session.email,
      }}
    />
  );
}

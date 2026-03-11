import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
 children
}: {
 children: React.ReactNode;
}) {

   const session = await auth()
    // [ ] Redirect to sign-in if not authenticated
    if (!session?.user) {
      redirect("/api/auth/signin")
    }

  return (
    <section className="min-h-screen max-w-md mx-auto">
      {children}
    </section>
  );
}
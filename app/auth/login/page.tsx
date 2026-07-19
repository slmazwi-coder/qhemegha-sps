import { SiteShell } from "@/components/public/site-shell";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Staff login | Qhemegha Senior Primary School",
};

export default function LoginPage() {
  return (
    <SiteShell>
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">
            Staff portal
          </h1>
        </div>
      </section>
      <section className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-sm px-4">
          <LoginForm />
        </div>
      </section>
    </SiteShell>
  );
}

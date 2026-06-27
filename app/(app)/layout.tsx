import AppNav from "@/components/AppNav";
import Disclaimer from "@/components/Disclaimer";
import AuthGate from "@/components/AuthGate";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <AuthGate>{children}</AuthGate>
      </main>
      <Disclaimer />
    </>
  );
}

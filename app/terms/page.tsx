import { TermsContent } from "@/components/legal/TermsContent";
import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-zinc-950/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-6">
          <Scale className="h-6 w-6 text-violet-400" />
          <div>
            <h1 className="text-xl font-bold text-white">利用規約</h1>
            <p className="text-xs text-zinc-500">Suzuki Toto Service</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <TermsContent />
      </main>
    </div>
  );
}

import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
      <p>© 2026 Suzuki Toto Service</p>
      <p className="mt-2">
        <Link href="/terms" className="text-zinc-500 hover:text-violet-400">
          利用規約
        </Link>
        <span className="mx-2">|</span>
        <span>利用者は自己責任でご利用ください</span>
      </p>
    </footer>
  );
}

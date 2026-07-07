import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function TermsContent() {
  return (
    <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-zinc-300">
      <p className="text-zinc-400">
        最終更新日：2026年7月7日
        <br />
        運営者：Suzuki Toto Service（keikamotushige@gmail.com）
      </p>

      <section>
        <h2 className="text-lg font-semibold text-white">第1条（適用）</h2>
        <p>
          本利用規約（以下「本規約」）は、Suzuki Toto Service
          が提供する「Voice AI Image
          Studio」その他関連サービス（以下「本サービス」）の利用条件を定めるものです。利用者は本サービスを利用することにより、本規約に同意したものとみなされます。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">
          第2条（利用者の責任）
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            本サービスを通じて生成・編集・アップロードされたすべてのコンテンツに関する責任は、利用者自身が負うものとします。
          </li>
          <li>
            運営者は、利用者が作成したコンテンツの内容、合法性、正確性、著作権の有無について一切の責任を負いません。
          </li>
          <li>
            利用者は、自己の行為および生成物が第三者の権利を侵害しないことを確認する責任を負います。
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">第3条（禁止事項）</h2>
        <p>利用者は、以下の行為を行ってはなりません。</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>著作権、商標権、肖像権、プライバシー権その他の権利を侵害する行為</li>
          <li>第三者の作品・キャラクター・有名人等を無断で模倣・複製・改変する行為</li>
          <li>違法、有害、差別的、暴力的、性的に不適切なコンテンツの生成・配布</li>
          <li>児童に関する性的コンテンツの生成・配布（絶対禁止）</li>
          <li>なりすまし、詐欺、誹謗中傷、虚偽情報の拡散</li>
          <li>法令または公序良俗に反する行為</li>
          <li>OpenAI 等の外部サービスの利用規約に違反する行為</li>
          <li>本サービスのセキュリティを妨害する行為</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">
          第4条（AI生成コンテンツについて）
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            本サービスが生成する画像は AI
            により自動生成されたものであり、正確性・合法性・商用利用可否を保証するものではありません。
          </li>
          <li>
            生成物が既存の著作物と類似する場合があります。利用者は公開・販売・配布前に自己の責任で確認してください。
          </li>
          <li>
            第三者の商標・キャラクター・実在人物の肖像を含む生成・編集は、権利者の許諾なく行わないでください。
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">第5条（免責事項）</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            運営者は、本サービスの利用により生じた損害（著作権侵害を含む）について、一切の責任を負いません。
          </li>
          <li>
            本サービスは現状有姿で提供され、動作の保証、生成結果の品質保証、継続提供の保証を行いません。
          </li>
          <li>
            外部API（OpenAI等）の障害・仕様変更・利用停止によりサービスが影響を受けても、運営者は責任を負いません。
          </li>
          <li>
            利用者が本規約または法令に違反した場合、運営者は利用停止等の措置を取ることができます。
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">
          第6条（知的財産権）
        </h2>
        <p>
          本サービスのプログラム、デザイン、ロゴ等の権利は運営者に帰属します。利用者がアップロードした画像の権利は利用者に帰属しますが、利用者は運営者に対し、サービス提供に必要な範囲での処理を許諾するものとします。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">
          第7条（規約の変更）
        </h2>
        <p>
          運営者は、必要に応じて本規約を変更できます。変更後に本サービスを利用した場合、変更後の規約に同意したものとみなします。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">
          第8条（準拠法・管轄）
        </h2>
        <p>
          本規約は日本法に準拠します。紛争が生じた場合、運営者所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </section>

      <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <p className="flex items-start gap-2 text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            本サービスを利用する前に、上記内容をよくお読みください。違法行為や著作権侵害を行わないでください。すべての責任は利用者に帰属します。
          </span>
        </p>
      </section>

      <p className="text-center">
        <Link href="/" className="text-violet-400 hover:text-violet-300">
          ← トップページに戻る
        </Link>
      </p>
    </div>
  );
}

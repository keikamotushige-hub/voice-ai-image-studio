const PROHIBITED_PATTERNS = [
  /著作権侵害/i,
  /copyright\s*infring/i,
  /違法/i,
  /犯罪/i,
  /児童|未成年.*(?:性的|ポルノ|ヌード)/i,
  /child\s*(?:porn|abuse|sexual)/i,
  /テロ/i,
  /殺人/i,
  /無断複製/i,
  /海賊版/i,
  /なりすまし/i,
  /ディープフェイク.*(?:芸能人|有名人|政治家)/i,
  /(?:芸能人|有名人|アイドル|キャラクター).*(?:になりすまし|を模倣|の顔)/i,
];

export function validatePrompt(prompt: string): string | null {
  const trimmed = prompt.trim();

  if (trimmed.length < 2) {
    return "プロンプトが短すぎます。";
  }

  if (trimmed.length > 2000) {
    return "プロンプトが長すぎます。";
  }

  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return "このプロンプトは利用規約に抵触する可能性があるため、処理できません。著作権・肖像権を侵害する内容、違法な内容は禁止されています。";
    }
  }

  return null;
}

export const LEGAL_NOTICE_SHORT =
  "本サービスの利用により、利用者は利用規約に同意したものとみなされます。生成・編集コンテンツに関する一切の責任は利用者が負い、運営者は責任を負いません。";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ImageStudio } from "@/components/studio/ImageStudio";

export default async function StudioPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/studio");

  return <ImageStudio user={session} />;
}

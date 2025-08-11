import { Suspense } from "react";
import StoriesContent from "@/components/StoriesContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Memuat cerita...</div>}>
      <StoriesContent />
    </Suspense>
  );
}

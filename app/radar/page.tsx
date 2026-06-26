import { Suspense } from "react";
import { RadarResult } from "@/components/radar-result";

export default function RadarPage() {
  return (
    <Suspense fallback={null}>
      <RadarResult />
    </Suspense>
  );
}

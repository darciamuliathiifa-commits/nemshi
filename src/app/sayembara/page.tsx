import { Suspense } from "react";
import { SayembaraBoard } from "./sayembara-board";

export default function SayembaraPage() {
  return (
    <Suspense>
      <SayembaraBoard />
    </Suspense>
  );
}

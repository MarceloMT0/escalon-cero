import type { Metadata } from "next";
import { PracticeWorkspace } from "@/features/practice/workspace";
export const metadata: Metadata = { title: "Mi práctica" };
export default function PracticePage() {
  return <PracticeWorkspace />;
}

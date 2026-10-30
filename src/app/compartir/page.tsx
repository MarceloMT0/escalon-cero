import type { Metadata } from "next";
import { SharedPortfolioPage } from "@/features/portfolio/shared-page";
export const metadata: Metadata = {
  title: "Portafolio de práctica",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};
export default function SharedPage() {
  return <SharedPortfolioPage />;
}

import type { Metadata } from "next";
import { PortfolioBuilder } from "@/features/portfolio/portfolio-builder";
export const metadata: Metadata = { title: "Mi portafolio" };
export default function PortfolioPage() {
  return <PortfolioBuilder />;
}

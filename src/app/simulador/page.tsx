import type { Metadata } from "next";
import { ShopSimulator } from "@/features/simulator/shop";
export const metadata: Metadata = { title: "Tienda de práctica · Nube" };
export default function SimulatorPage() {
  return <ShopSimulator />;
}

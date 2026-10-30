"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { decodePortfolio } from "./share";
import { PortfolioView } from "./portfolio-view";
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
function getHash() {
  return window.location.hash.slice(1);
}
export function SharedPortfolioPage() {
  const hash = useSyncExternalStore(subscribe, getHash, () => "");
  const portfolio = decodePortfolio(hash);
  if (!portfolio)
    return (
      <div className="page-container internal-page">
        <div className="empty-practice surface">
          <h1>Este enlace no contiene un proyecto válido.</h1>
          <p>Comprueba que copiaste el enlace completo, incluida la parte después del símbolo #.</p>
          <Link href="/" className={buttonVariants()}>
            Conocer Escalón Cero <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  return (
    <div className="page-container shared-portfolio-page">
      <div className="shared-toolbar">
        <span>Un proyecto de práctica, compartido por su autor.</span>
        <Button variant="secondary" size="small" onClick={() => window.print()}>
          <Printer size={16} />
          Guardar PDF
        </Button>
      </div>
      <PortfolioView portfolio={portfolio} />
    </div>
  );
}

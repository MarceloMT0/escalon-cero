import type { Metadata } from "next";
import localFont from "next/font/local";
import { ArchiveSpine } from "@/components/archive-spine";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
import "./archive-system.css";

const sans = localFont({
  src: "./fonts/PlusJakartaSans.ttf",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});
export const metadata: Metadata = {
  title: {
    default: "Escalón Cero · Tu experiencia empieza haciendo",
    template: "%s · Escalón Cero",
  },
  description:
    "Practica tareas de un rol junior en un entorno simulado y convierte tus resultados en un portafolio que puedes compartir.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={sans.variable}>
        <ArchiveSpine />
        <div className="site-frame">
          <SiteHeader />
          <main id="contenido">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

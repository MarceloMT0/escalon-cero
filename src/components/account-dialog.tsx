"use client";
import { useEffect, useState } from "react";
import { Cloud, HardDrive, UserRound } from "lucide-react";
import { cloudConfigured, getCloudClient } from "@/lib/supabase";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";

export function AccountDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!cloudConfigured) return;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    getCloudClient()
      .then(async (client) => {
        const { data } = await client.auth.getUser();
        if (active) setUserEmail(data.user?.email ?? null);
        const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
          if (active) setUserEmail(session?.user.email ?? null);
        });
        unsubscribe = () => listener.subscription.unsubscribe();
        if (!active) unsubscribe();
      })
      .catch(() => {
        if (active)
          setNotice("No se pudo comprobar tu sesión. Puedes seguir trabajando localmente.");
      });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);
  async function authenticate(mode: "login" | "signup") {
    setBusy(true);
    setNotice("");
    try {
      if (!email.trim() || password.length < 8)
        throw new Error("Introduce tu correo y una contraseña de al menos 8 caracteres.");
      const client = await getCloudClient();
      const response =
        mode === "login"
          ? await client.auth.signInWithPassword({ email: email.trim(), password })
          : await client.auth.signUp({ email: email.trim(), password });
      if (response.error)
        throw new Error(
          mode === "login"
            ? "No se pudo iniciar sesión. Revisa tus datos o confirma tu correo."
            : "No se pudo crear la cuenta. Revisa el correo e inténtalo de nuevo.",
        );
      setPassword("");
      setNotice(
        response.data.session
          ? "Tu cuenta está lista. Ya puedes sincronizar desde Mi práctica."
          : "Revisa tu correo para confirmar la cuenta antes de iniciar sesión.",
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ocurrió un error.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      title="Tu espacio en Escalón Cero"
      description="Practica a tu ritmo y conserva tu trabajo."
      trigger={
        <Button variant="ghost" size="icon" aria-label="Mi cuenta" className="account-trigger">
          <UserRound size={20} />
        </Button>
      }
    >
      {cloudConfigured ? (
        userEmail ? (
          <div className="stack">
            <div className="notice">
              <Cloud size={20} />
              <div>
                Sesión iniciada como <strong>{userEmail}</strong>
              </div>
            </div>
            <p>
              En Mi práctica puedes guardar una copia en tu cuenta o recuperar la última versión
              sincronizada.
            </p>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  const client = await getCloudClient();
                  const { error } = await client.auth.signOut();
                  if (error) throw error;
                  setNotice("Sesión cerrada. La copia local permanece en este dispositivo.");
                } catch {
                  setNotice("No se pudo cerrar la sesión. Vuelve a intentarlo.");
                }
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <form
            className="stack"
            onSubmit={(event) => {
              event.preventDefault();
              void authenticate("login");
            }}
          >
            <label className="field">
              Correo
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="field">
              Contraseña
              <input
                type="password"
                autoComplete="current-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <Button type="submit" disabled={busy}>
              {busy ? "Conectando…" : "Iniciar sesión"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => void authenticate("signup")}
            >
              Crear mi cuenta
            </Button>
          </form>
        )
      ) : (
        <div className="stack">
          <div className="notice">
            <HardDrive size={22} />
            <div>
              <strong>Prueba sin crear una cuenta</strong>
              <p>
                Tu trabajo y tus archivos se guardan en este navegador. Si borras sus datos o
                cambias de dispositivo, no aparecerán aquí.
              </p>
            </div>
          </div>
          <p>
            Puedes descargar tu entrega y generar un enlace que comparta únicamente el texto que
            elijas. La sincronización con cuentas estará disponible cuando se active el servicio.
          </p>
        </div>
      )}
      {notice ? (
        <p className="feedback" role="status">
          {notice}
        </p>
      ) : null}
    </Dialog>
  );
}

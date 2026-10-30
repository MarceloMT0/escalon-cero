"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startPractice, usePractice } from "./store";
export function StartButton() {
  const router = useRouter();
  const draft = usePractice();
  const [error, setError] = useState("");
  return (
    <>
      <Button
        onClick={() => {
          try {
            startPractice();
            router.push("/practica/");
          } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo iniciar.");
          }
        }}
      >
        {draft.startedAt ? "Continuar mi práctica" : "Empezar mi práctica"}
        <ArrowRight size={18} />
      </Button>
      {error ? (
        <p role="alert" className="feedback error">
          {error}
        </p>
      ) : null}
    </>
  );
}

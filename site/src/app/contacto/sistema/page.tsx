import type { Metadata } from "next";
import SistemaQuiz from "@/components/SistemaQuiz";

/**
 * The quiz replaced the contact form here. The original form page is preserved
 * verbatim in git history (commit 794ff01) if it's ever needed again.
 */

export const metadata: Metadata = {
  title: "¿Qué tipo de movida eres? | Muévete con Andrea",
  description:
    "9 preguntas, 90 segundos. Descubre por qué los programas de fitness no te han funcionado — y qué haría Andrea en tu caso.",
};

export default function ContactoSistemaPage() {
  return <SistemaQuiz />;
}

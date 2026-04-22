"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CarouselTransitionProvider } from "@/components/CarouselTransition";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isContactPage = pathname?.startsWith("/contacto");

  return (
    <CarouselTransitionProvider>
      <SmoothScroll />
      {!isContactPage && <Navigation />}
      <main className="min-w-0 [overflow-x:clip]">{children}</main>
      {!isContactPage && <Footer />}
    </CarouselTransitionProvider>
  );
}

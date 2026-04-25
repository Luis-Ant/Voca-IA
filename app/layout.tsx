import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Voca-IA",
    template: "%s | Voca-IA",
  },
  description: "Orientación vocacional simple para explorar ramas y carreras.",
  applicationName: "Voca-IA",
};

type Props = { children: ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

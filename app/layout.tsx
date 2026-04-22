import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Voca-IA",
  description: "Orientación vocacional",
};

type Props = { children: ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

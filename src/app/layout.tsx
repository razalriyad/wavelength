import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeBootstrap from "./ThemeBootstrap";
export const metadata: Metadata = {
  title: "WAVELENGTH / Audio Visual System",
  description: "Personal streaming deck and real-time audio visualizer.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wavelength",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body><ThemeBootstrap />{children}</body>
    </html>
  );
}

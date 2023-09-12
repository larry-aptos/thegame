import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-screen h-full scroll-smooth">
      <body style={{ backgroundColor: "#0d011d", color: "white" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

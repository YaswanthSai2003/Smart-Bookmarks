import "./globals.css";
import ToasterClient from "../app/app/components/ToasterClient";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToasterClient />
      </body>
    </html>
  );
}

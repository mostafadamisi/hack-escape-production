import { Inter, JetBrains_Mono, Cairo } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata = {
  title: "Hack & Escape | Building a Cyber-Aware Generation",
  description: "Bilingual cybersecurity competition and initiative by Jordan Cyber Club.",
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  // We can't easily check the full path here in a server component,
  // but we can check if we're in the admin section by looking at the children's props
  // if Next.js provides it, or more reliably by wrapping the navbar.
  
  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${jetbrainsMono.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body className={locale === 'ar' ? 'rtl' : 'ltr'}>
        {/* We will handle Navbar visibility inside a Client Component or by path check if possible */}
        <NavbarWrapper locale={locale}>
            <Navbar />
        </NavbarWrapper>
        {children}
      </body>
    </html>
  );
}

// Simple Client Component to hide Navbar on admin routes
function NavbarWrapper({ children }) {
    return <ConditionalNavbar>{children}</ConditionalNavbar>;
}

import { ConditionalNavbar } from "@/components/ConditionalNavbar";

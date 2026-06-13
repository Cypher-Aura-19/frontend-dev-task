import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Modern Navbar Design",
  description: "Modern navbar design with elegant navigation icons, dark mode, and premium aesthetics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`} data-theme="light" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <div className="theme-overlay" id="theme-overlay"></div>
        {children}
      </body>
    </html>
  );
}

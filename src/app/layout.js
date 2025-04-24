import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "وقتي",
  description: "تابع مهامك، أنجز أهدافك",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href='/favicon.png' type="image/svg+xml" />
        <title>{metadata.title}</title>
      </head>
      <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

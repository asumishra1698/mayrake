import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://mayrake.web.app"),
  title: "Mayrake Fashion Brand - The Clothing Effect",
  description: "Discover the latest trends in fashion with Mayrake. Explore our exclusive collections and elevate your style with our premium clothing line.",
  icons: {
    icon: "/fav.jpg",
  },
  openGraph: {
    title: "Mayrake Fashion Brand - The Clothing Effect",
    description:
      "Discover the latest trends in fashion with Mayrake. Explore our exclusive collections and elevate your style with our premium clothing line.",
    url: "https://mayrake.web.app",
    siteName: "Mayrake",
    images: [
      {
        url: "/fav.jpg?v=2",
        width: 512,
        height: 512,
        alt: "Mayrake",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayrake Fashion Brand - The Clothing Effect",
    description:
      "Discover the latest trends in fashion with Mayrake. Explore our exclusive collections and elevate your style with our premium clothing line.",
    images: ["/fav.jpg?v=2"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

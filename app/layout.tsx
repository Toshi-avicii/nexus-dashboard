import type { Metadata } from "next";
import { Quicksand, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import StoreProvider from "@/components/StoreProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "sonner";
import Script from "next/script";


const quickSand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"]
});

const notoSans = Noto_Sans({
  variable: "--font-notosans",
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Nexus",
  description: "Everything - At your fingertips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${quickSand.variable} ${notoSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <QueryProvider>
              {children}
              <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
              />
              <Toaster richColors />
            </QueryProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

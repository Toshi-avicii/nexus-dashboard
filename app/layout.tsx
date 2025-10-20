import type { Metadata } from "next";
import { Quicksand, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import StoreProvider from "@/components/StoreProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "sonner";

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
              <Toaster richColors />
            </QueryProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import AsyncMultiDialog from "@/components/NMultiDialog";
import { Libre_Baskerville, Lora, IBM_Plex_Mono } from 'next/font/google'


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}


const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className={`bg-white w-screen h-screen ${lora.className} antialiased print:p-0 print:bg-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <div className="print:hidden">
            <AsyncMultiDialog />
          </div>
        </ThemeProvider>
        <Toaster richColors className="print:hidden" position="top-center" />
      </body>
    </html>
  );
}

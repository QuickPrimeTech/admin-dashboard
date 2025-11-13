import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@ui/sonner";
import { ThemeProvider } from "@providers/theme-provider";
import { QueryProvider } from "@providers/query-provider";
import { BranchProvider } from "@providers/branch-provider";
import { getCurrentBranchId } from "@/helpers/common";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant Admin Dashboard",
  description: "Access all your website's data and manage it seamlessly.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //Getting the current branch in order to pass it to the client
  const branchId = await getCurrentBranchId() ?? '';
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
           <BranchProvider initialBranchId={branchId}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            {children}
            <Toaster richColors position="top-center" closeButton />
          </ThemeProvider>
            </BranchProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

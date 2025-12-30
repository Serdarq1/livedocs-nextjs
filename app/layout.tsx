import type { Metadata } from "next";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Provider from "./Provider";


export const metadata: Metadata = {
  title: "Livedocs",
  description: "Edit, create and write documents collabratively!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {colorPrimary: "#3371FF", fontSize: '16px'},

      }}>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased">
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}

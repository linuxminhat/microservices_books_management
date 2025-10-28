import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import BootstrapClient from "../components/BootstrapClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "CFC Books - Library Management",
  description: "Your digital library management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
        <script src="https://js.stripe.com/v3" async></script>
      </head>
      <body>
        <UserProvider>
          {children}
        </UserProvider>
        <BootstrapClient />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import Header from "./ui/header";
import Footer from "./ui/footer";
import "./styles/index.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{scrollBehavior: "smooth"}}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
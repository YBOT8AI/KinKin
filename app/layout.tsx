import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KINKIN - Neighborhood Services",
  description: "Help neighbors, earn money, level up",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

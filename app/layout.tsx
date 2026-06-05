import { Bricolage_Grotesque, Fraunces } from "next/font/google";

// Body font — versatile grotesque with wide weight range
const body = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
  variable: "--font-body",
  display: "swap",
});

// Display font — expressive serif with optical sizing
const display = Fraunces({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  variable: "--font-display",
  axes: ["SOFT", "WONK"], // unique variable axes for character
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable}`}
    >
      <body style={{ fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );
}
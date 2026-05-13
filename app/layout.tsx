import { JetBrains_Mono, Inter } from "next/font/google";

const jbMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono", // Allows use in Tailwind as 'font-mono'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jbMono.variable} ${inter.variable}`}>
      <body className="font-mono bg-black antialiased">
        {children}
      </body>
    </html>
  );
}

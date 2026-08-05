import Header from '../shared/widgets/header';
import './global.css';
import { Poppins, Roboto } from "next/font/google";

export const metadata = {
  title: 'E-market',
  description: 'E-market is an e-commerce SAAS where consumers can come and buy their desired items from different vendors.',
}

//font configuration
const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-roboto"
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins"
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <Header/>
        {children}
      </body>
    </html>
  )
}

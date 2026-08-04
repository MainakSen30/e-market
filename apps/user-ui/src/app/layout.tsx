import Header from '../shared/widgets/header';
import './global.css';

export const metadata = {
  title: 'E-market',
  description: 'E-market is an e-commerce SAAS where consumers can come and buy their desired items from different vendors.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header/>
        {children}
      </body>
    </html>
  )
}

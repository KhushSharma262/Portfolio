import '../styles/globals.scss'
import Navbar from './components/Navbar/Navbar'
import Cursor from './components/Cursor/Cursor'

export const metadata = {
  title: 'Khush Sharma - Digital Identity',
  description: 'Not a portfolio. A digital version of a person.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  )
}

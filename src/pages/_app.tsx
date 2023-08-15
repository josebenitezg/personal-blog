import '../styles/index.css'
import '../styles/global.css'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
    )
    ;
}

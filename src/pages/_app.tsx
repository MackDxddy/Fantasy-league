import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../../styles/theme'
import createEmotionCache from 'lib/helpers/createEmotionCache'
import { PaletteMode, createTheme } from '@mui/material'
import { getDesignTokens } from '../../styles/setTheme'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [mode, setMode] = React.useState<PaletteMode>('dark')
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}

// import * as React from 'react'
// import Head from 'next/head'
// import CssBaseline from '@material-ui/core/CssBaseline'
// import { ThemeProvider } from '@mui/material/styles'
// import { PaletteMode, createTheme } from '@mui/material'
// import { getDesignTokens } from '../../styles/setTheme'

// export default function MySaaSApp({ Component, pageProps }) {
//   const [mode, setMode] = React.useState<PaletteMode>('dark')
//   const colorMode = React.useMemo(
//     () => ({
//       // The dark mode switch would invoke this method
//       toggleColorMode: () => {
//         setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'))
//       }
//     }),
//     []
//   )

//   React.useEffect(() => {
//     const jssStyles = document.querySelector('#jss-server-side')
//     if (jssStyles) {
//       jssStyles.parentElement.removeChild(jssStyles)
//     }
//   }, [])

//   const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])

//   return (
//     <React.Fragment>
//       <Head>
//         <title>LoL Esports Tracker</title>
//         <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
//       </Head>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <Component {...pageProps} />
//       </ThemeProvider>
//     </React.Fragment>
//   )
// }

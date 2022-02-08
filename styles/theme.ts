import { responsiveFontSizes, createTheme } from '@mui/material/styles'
import { orange, red, amber, deepOrange, grey, deepPurple } from '@mui/material/colors'

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string
    }
  }
}

let theme = createTheme({
  status: {
    danger: red[500]
  },
  palette: {
    mode: 'dark',
    primary: {
      main: orange[500]
    }
  },
})

theme = responsiveFontSizes(theme)

export default theme

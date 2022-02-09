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

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true// removes the `xs` breakpoint
    sm: true 
    md: true 
    lg: true
    xl: true
  }
}

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1800
    }
  },
  status: {
    danger: red[500]
  },
  palette: {
    mode: 'dark',
    primary: {
      main: orange[500]
    }
  }
})

theme = responsiveFontSizes(theme)

export default theme

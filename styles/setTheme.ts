import { PaletteMode } from '@mui/material'
import { amber, deepPurple, grey } from '@mui/material/colors'

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: amber,
          divider: amber[200],
          text: {
            primary: grey[900],
            secondary: grey[800]
          }
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#000'
          },
          divider: grey[100],
          background: {
            // default: grey[900],
            // paper: grey[800]
            default: '#000',
            paper: '#000'
          },
          text: {
            primary: '#fff',
            secondary: grey[500]
          }
        })
  }
})

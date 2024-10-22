import React from 'react'
import ReactDOM from 'react-dom/client' // Import from 'react-dom/client'
import App from './App'
import './global.css' // Import global styles
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Provider } from 'react-redux'
import store, { persistor } from './store' // Import the Redux store
import { PersistGate } from 'redux-persist/integration/react'

const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans, sans-serif'
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Open Sans, sans-serif',
          color: 'rgba(0,0,0,0.87)',
          '&.noData': {
            paddingLeft: 24,
            paddingBottom: 8,
            color: 'rgba(0,0,0,0.6)'
          },
          '&.customer': {
            paddingTop: 48,
            marginBottom: 20,
            paddingLeft: 16
          }
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: '600'
        },
        h5: {
          fontSize: '1.3rem',
          fontWeight: '600'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '&.procurement': {
            marginBottom: 120
          },
          '&.section': {
            padding: '24px 0',
            marginBottom: 16,
            backgroundColor: '#fbfbfb',
            borderRadius: 24,
            border: '3px solid #fff'
          },
          '&.sectionHeader': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            minHeight: 32,
            '& .winner': {
              opacity: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              color: '#89CE7B',
              paddingRight: 12,
              fontWeight: '700'
            }
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.03)'
          }
        },
        head: {
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          textAlign: 'right',
          fontWeight: '700',
          fontSize: '1rem',
          color: 'rgba(0,0,0,0.33)',
          border: 'none',
          borderBottom: '3px solid #eee',
          '&.name': {
            textAlign: 'left',
            paddingLeft: 24
          }
        },
        body: {
          textAlign: 'right',
          fontSize: '1.2rem',
          color: 'rgba(0,0,0,0.87)',
          border: 'none',
          borderBottom: 'none',
          '&.icon': {
            width: 32,
            padding: 0
          },
          '&.name': {
            textAlign: 'left',
            paddingLeft: 24
          },
          '&.cumulative': {
            fontWeight: '700'
          },
          '&.action': {
            width: 36,
            paddingRight: 16
          },
          '&.component': {
            width: '30%',
            textAlign: 'left',
            paddingLeft: 24
          },
          '&.system': {
            textAlign: 'left',
            width: '40%',
            paddingLeft: 8
          },
          '&.groupItem': {
            borderBottom: '2px dashed #f3f3f3',
            paddingRight: 24
          },
          '&.lastInGroup': {
            borderBottom: '2px solid #f3f3f3',
            paddingRight: 24
          }
        }
      }
    }
  }
})

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material'
import { theme } from '~/themes/theme'
import useRouteElements from '~/routes/useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RefreshToken from '~/components/RefreshToken'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/en-gb'
import { BookingProvider } from './contexts/BookingContext'
import { HelmetProvider } from 'react-helmet-async'
import { BookingAmenityProvider } from './contexts/BookingAmenityContext'

function App() {
  const routeElements = useRouteElements()
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='en-gb'>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <BookingProvider>
            <BookingAmenityProvider>
              {routeElements}
              <RefreshToken />
              <ReactQueryDevtools initialIsOpen={false} />
            </BookingAmenityProvider>
          </BookingProvider>
          <ToastContainer />
        </ThemeProvider>
      </HelmetProvider>
    </LocalizationProvider>
  )
}

export default App

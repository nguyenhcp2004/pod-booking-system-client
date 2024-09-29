import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material'
import { theme } from '~/themes/theme'
import useRouteElements from '~/routes/useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RefreshToken from '~/components/RefreshToken'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/vi'

function App() {
  const routeElements = useRouteElements()
  return (
    <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='vi'>
          {routeElements}
        </LocalizationProvider>
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
      <ToastContainer />
    </>
  )
}

export default App

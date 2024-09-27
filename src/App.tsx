import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material'
import { theme } from '~/themes/theme'
import useRouteElements from '~/routes/useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
<<<<<<< HEAD
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/en-gb';
=======
import RefreshToken from '~/components/RefreshToken'
>>>>>>> 6d0f3167de9a0759f4957da257d600acfd014dfd

function App() {
  const routeElements = useRouteElements()
  return (
    <>
<<<<<<< HEAD
=======
      <ThemeProvider theme={theme}>
        {routeElements}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
>>>>>>> 6d0f3167de9a0759f4957da257d600acfd014dfd
      <ToastContainer />
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='en-gb'>
        <ThemeProvider theme={theme}>
          {routeElements}
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </LocalizationProvider>
    </>
  )
}

export default App

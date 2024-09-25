import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material'
import { theme } from '~/themes/theme'
import useRouteElements from '~/routes/useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElements = useRouteElements()
  return (
    <>
      <ThemeProvider theme={theme}>
        {routeElements}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
      <ToastContainer />
    </>
  )
}

export default App

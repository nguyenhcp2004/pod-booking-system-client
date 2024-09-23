import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material'
import { theme } from '~/themes/theme'
import useRouteElements from '~/routes/useRouteElements'

function App() {
  const routeElements = useRouteElements()
  return (
    <>
      <ThemeProvider theme={theme}>
        {routeElements}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </>
  )
}

export default App

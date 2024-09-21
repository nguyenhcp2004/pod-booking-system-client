import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material'
import { theme } from './themes/theme'

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <div>nguyenhuynh</div>
        <Button variant='contained'>Hello world</Button>
        <AccessAlarmIcon />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </>
  )
}

export default App

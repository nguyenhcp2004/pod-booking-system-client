import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      <div>nguyenhuynh</div>
      <Button variant='contained'>Hello world</Button>
      <AccessAlarmIcon />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App

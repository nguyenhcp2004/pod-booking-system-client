import { Backdrop, CircularProgress, useTheme } from '@mui/material'

const BackdropCustom = ({ loading }: { loading: boolean }) => {
  const theme = useTheme()
  return (
    loading && (
      <Backdrop
        sx={{
          zIndex: theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color='primary' />
      </Backdrop>
    )
  )
}

export default BackdropCustom

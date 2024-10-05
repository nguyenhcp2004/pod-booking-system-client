import { Box, CircularProgress, useTheme } from '@mui/material'
import { tokens } from '~/themes/theme'

const Loading = ({ loading }: { loading: boolean }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    loading && (
      <Box
        sx={{
          backgroundColor: colors.grey[100],
          opacity: '0.5 !important',
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        <CircularProgress color='primary' />
      </Box>
    )
  )
}

export default Loading

import { Box, Button, Typography } from '@mui/material'

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const Amenities: React.FC<CommonProps> = (props) => {
  return (
    <Box>
      <Typography variant={'h1'}>Add Amenities</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={props.onBack} sx={{ mr: 1 }}>
          Quay lại
        </Button>
        <Button variant='contained' onClick={props.onNext}>
          Tiếp tục
        </Button>
      </Box>
    </Box>
  )
}

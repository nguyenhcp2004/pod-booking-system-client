import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { tokens } from '~/themes/theme'

export default function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '120px',
        padding: '10px',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        backgroundColor: (theme) => theme.palette.primary.main
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: '1',
          alignSelf: 'stretch',
          padding: '24px 104px',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            alignSelf: 'stretch'
          }}
        >
          <Typography
            variant='h3'
            sx={{
              fontWeight: '700',
              color: tokens('light').primary[50],
              fontSize: '39px',
              lineHeight: '120%'
            }}
          >
            FlexiPod
          </Typography>
          <Typography
            sx={{
              fontWeight: '400',
              color: tokens('light').grey[50],
              fontSize: '12px',
              lineHeight: '120%'
            }}
          >
            Copyright © 2024
          </Typography>
        </Box>
        <Box
          display={{ xs: 'none', md: 'flex' }}
          sx={{
            width: '500px',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            alignSelf: 'stretch'
          }}
        >
          <Button
            sx={{
              textTransform: 'uppercase',
              lineHeight: '22px',
              letterSpacing: '0.46px',
              fontWeight: '500',
              color: tokens('light').grey[50]
            }}
          >
            Privacy Policy
          </Button>
          <Button
            sx={{
              textTransform: 'uppercase',
              lineHeight: '22px',
              letterSpacing: '0.46px',
              fontWeight: '500',
              color: tokens('light').grey[50]
            }}
          >
            Terms & Conditions
          </Button>
          <Button
            sx={{
              textTransform: 'uppercase',
              lineHeight: '22px',
              letterSpacing: '0.46px',
              fontWeight: '500',
              color: tokens('light').grey[50]
            }}
          >
            Cookie Policy
          </Button>
          <Button
            sx={{
              textTransform: 'uppercase',
              lineHeight: '22px',
              letterSpacing: '0.46px',
              fontWeight: '500',
              color: tokens('light').grey[50]
            }}
          >
            Contact
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

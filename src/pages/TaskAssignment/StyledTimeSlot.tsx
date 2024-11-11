import { Box, styled } from '@mui/material'

export const StyledTimeSlot = styled(Box)(({ theme }) => ({
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: theme.palette.grey[200],
  color: theme.palette.text.primary,
  transition: 'all 0.3s ease',
  '&:nth-of-type(odd)': {
    background: theme.palette.grey[300]
  },
  '&:hover': {
    background: theme.palette.grey[400],
    transform: 'scale(1.02)'
  }
}))

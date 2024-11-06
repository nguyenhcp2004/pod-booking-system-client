import { Box, styled } from '@mui/material'

export const StyledDayHeader = styled(Box)(({ theme }) => ({
  height: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: theme.typography.fontWeightBold,
  backgroundColor: theme.palette.background.paper
}))

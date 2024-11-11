import { Paper, styled } from '@mui/material'

export const StyledPaper = styled(Paper)(({ theme }) => ({
  height: 120,
  overflowY: 'auto',
  padding: theme.spacing(1),
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    '& .add-event': { opacity: 1 }
  }
}))

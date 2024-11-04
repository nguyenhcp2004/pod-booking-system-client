import { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  styled,
  Chip
} from '@mui/material'
import { Add } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'

const timeSlots = ['7h-9h', '9h-11h', '11h-13h', '13h-15h', '15h-17h', '17h-19h']
const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
type Slot = {
  day: string
  timeSlot: string
}

const StyledHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2, 3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3]
}))

const StyledTimeSlot = styled(Box)(({ theme }) => ({
  height: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: theme.palette.grey[50],
  '&:nth-of-type(odd)': {
    background: theme.palette.grey[100]
  }
}))

const StyledDayHeader = styled(Box)(({ theme }) => ({
  height: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: 'bold'
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: 100,
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

const chipColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F06292',
  '#AED581',
  '#FFD54F',
  '#4DB6AC',
  '#7986CB'
]

export default function TaskAssignment() {
  const [events, setEvents] = useState<Record<string, string[]>>({})
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [newEvent, setNewEvent] = useState('')

  const handleAddEvent = (day: string, timeSlot: string) => {
    setSelectedSlot({ day, timeSlot })
    setIsAddEventOpen(true)
  }

  const handleSaveEvent = () => {
    if (newEvent.trim() !== '') {
      const key = `${selectedSlot?.day}-${selectedSlot?.timeSlot}`
      setEvents((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), newEvent]
      }))
      setNewEvent('')
      setIsAddEventOpen(false)
    }
  }
  console.log(events)

  const employeeColors = useMemo(() => {
    const colorMap = new Map()
    const allEmployees = new Set(Object.values(events).flat())
    Array.from(allEmployees).forEach((employee, index) => {
      colorMap.set(employee, chipColors[index % chipColors.length])
    })
    return colorMap
  }, [events])

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3, boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}>
      <StyledHeader>
        <Typography variant='h4' fontWeight='500'>
          Ca trực của nhân viên
        </Typography>
      </StyledHeader>
      <Grid container>
        <Grid size={{ xs: 2 }}>
          <Box sx={{ height: 50 }} />
          {timeSlots.map((slot, index) => (
            <StyledTimeSlot key={index}>
              <Typography variant='body1' fontWeight='medium'>
                {slot}
              </Typography>
            </StyledTimeSlot>
          ))}
        </Grid>
        {weekDays.map((day) => (
          <Grid size={{ xs: 1.4 }} key={day}>
            <StyledDayHeader>
              <Typography variant='body1'>{day}</Typography>
            </StyledDayHeader>
            {timeSlots.map((slot) => (
              <StyledPaper key={`${day}-${slot}`}>
                {events[`${day}-${slot}`]?.map((event, index) => (
                  <Chip
                    key={index}
                    label={event}
                    size='small'
                    style={{
                      backgroundColor: employeeColors.get(event),
                      color: 'white',
                      margin: '2px',
                      fontWeight: 'bold'
                    }}
                  />
                ))}
                <IconButton
                  size='small'
                  className='add-event'
                  onClick={() => handleAddEvent(day, slot)}
                  sx={{
                    position: 'absolute',
                    right: 2,
                    bottom: 2,
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <Add fontSize='small' />
                </IconButton>
              </StyledPaper>
            ))}
          </Grid>
        ))}
      </Grid>
      <Dialog
        sx={{ '& .MuiPaper-root': { width: 350 } }}
        open={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
      >
        <DialogTitle>Thêm nhân viên</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Tên nhân viên'
            fullWidth
            variant='outlined'
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddEventOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveEvent} variant='contained'>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

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
  styled,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Add } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'

const timeSlots = [
  '7:00 - 9:00',
  '9:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '17:00 - 19:00',
  '19:00 - 21:00'
]
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

const StyledDayHeader = styled(Box)(({ theme }) => ({
  height: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: theme.typography.fontWeightBold,
  backgroundColor: theme.palette.background.paper
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
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

const shift = {
  'T2-7:00 - 9:00': ['Nguyen Van A', 'Tran Thi B'],
  'T3-7:00 - 9:00': ['Le Van C', 'Nguyen Van D'],
  'T4-7:00 - 9:00': ['Pham Thi E'],
  'T5-7:00 - 9:00': ['Nguyen Van F', 'Do Thi G'],
  'T6-7:00 - 9:00': ['Hoang Van H']
}

export default function TaskAssignment() {
  const [events, setEvents] = useState<Record<string, string[]>>(shift)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [newEvent, setNewEvent] = useState('')
  const [hoveredChip, setHoveredChip] = useState<string | null>(null) // State để lưu chip đang hover
  console.log(events)
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

  const employeeColors = useMemo(() => {
    const colorMap = new Map()
    const allEmployees = new Set(Object.values(events).flat())
    Array.from(allEmployees).forEach((employee, index) => {
      colorMap.set(employee, chipColors[index % chipColors.length])
    })
    return colorMap
  }, [events])

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: 'auto',
        p: 3,
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: 2,
        backgroundColor: '#f5f5f5'
      }}
    >
      <StyledHeader>
        <Typography variant='h4' fontWeight='500'>
          Ca trực của nhân viên
        </Typography>
      </StyledHeader>
      <Grid container>
        <Grid size={{ xs: 1.5 }}>
          <Box sx={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button startIcon={<Add />} onClick={() => setIsAddEventOpen(true)}>
              Thêm nhân viên
            </Button>
          </Box>
          {timeSlots.map((slot, index) => (
            <StyledTimeSlot key={index}>
              <Typography variant='body1' fontWeight='medium'>
                {slot}
              </Typography>
            </StyledTimeSlot>
          ))}
        </Grid>
        {weekDays.map((day) => (
          <Grid size={{ xs: 1.5 }} key={day}>
            <StyledDayHeader>
              <Typography variant='body1'>{day}</Typography>
            </StyledDayHeader>
            {timeSlots.map((slot) => (
              <StyledPaper key={`${day}-${slot}`}>
                {events[`${day}-${slot}`]?.map((event, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredChip(event)}
                    onMouseLeave={() => setHoveredChip(null)}
                    style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}
                  >
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
                    {hoveredChip === event && (
                      <IconButton
                        size='small'
                        aria-label='remove'
                        sx={{
                          height: 20,
                          position: 'absolute',
                          right: -1,
                          top: 5,
                          backgroundColor: 'grey.200',
                          borderRadius: '50%',
                          '&:hover': {
                            backgroundColor: 'grey.200'
                          }
                        }}
                      >
                        x
                      </IconButton>
                    )}
                  </div>
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
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel size='small' id='time-slot-label'>
              Nhân viên
            </InputLabel>
            <Select
              size='small'
              labelId='time-slot-label'
              value={newEvent}
              label='Nhân viên'
              onChange={(e) => {
                setNewEvent(e.target.value)
              }}
            >
              <MenuItem value='Nguyên'>Nguyên</MenuItem>
              <MenuItem value='Huy'>Huy</MenuItem>
              <MenuItem value='Hoàng'>Hoàng</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel size='small' id='time-slot-label'>
              Ngày trực
            </InputLabel>
            <Select
              size='small'
              labelId='time-slot-label'
              value={selectedSlot?.day || ''}
              label='Ngày trực'
              onChange={(e) => {
                setSelectedSlot({ day: e.target.value, timeSlot: selectedSlot?.timeSlot || '' })
              }}
            >
              <MenuItem value='T2'>Thứ 2</MenuItem>
              <MenuItem value='T3'>Thứ 3</MenuItem>
              <MenuItem value='T4'>Thứ 4</MenuItem>
              <MenuItem value='T5'>Thứ 5</MenuItem>
              <MenuItem value='T6'>Thứ 6</MenuItem>
              <MenuItem value='T7'>Thứ 7</MenuItem>
              <MenuItem value='CN'>Chủ nhật</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel size='small' id='time-slot-label'>
              Khung giờ
            </InputLabel>
            <Select
              size='small'
              labelId='time-slot-label'
              value={selectedSlot?.timeSlot || ''}
              label='Khung giờ'
              onChange={(e) => {
                setSelectedSlot({ day: selectedSlot?.day || '', timeSlot: e.target.value })
              }}
            >
              <MenuItem value='7:00 - 9:00'>7h - 9h</MenuItem>
              <MenuItem value='9:00 - 11:00'>9h - 11h</MenuItem>
              <MenuItem value='11:00 - 13:00'>11h - 13h</MenuItem>
              <MenuItem value='13:00 - 15:00'>13h - 15h</MenuItem>
              <MenuItem value='15:00 - 17:00'>15h - 17h</MenuItem>
              <MenuItem value='17:00 - 19:00'>17h - 19h</MenuItem>
              <MenuItem value='19:00 - 21:00'>19h - 21h</MenuItem>
            </Select>
          </FormControl>
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

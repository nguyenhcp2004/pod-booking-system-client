import {
  Box,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import moment, { Moment } from 'moment'
import { useMemo, useState } from 'react'
import { tokens } from '~/themes/theme'

const INITIAL_COLUMNS = [
  { id: 'sunday', label: 'CN' },
  { id: 'monday', label: 'T2' },
  { id: 'tuesday', label: 'T3' },
  { id: 'wednesday', label: 'T4' },
  { id: 'thursday', label: 'T5' },
  { id: 'friday', label: 'T6' },
  { id: 'saturday', label: 'T7' }
]

const MonthView = ({ selected }: { selected: Moment[] | null }) => {
  const [from, setFrom] = useState(moment().startOf('month').format('YYYY-MM-DD'))
  const [to, setTo] = useState(moment().endOf('month').format('YYYY-MM-DD'))
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const currentDay = moment().format('YYYY-MM-DD')

  const daysOfMonth = useMemo(() => {
    const days = []
    const startDate = moment(from).startOf('week')
    const endDate = moment(to).endOf('week')
    while (startDate.isSameOrBefore(endDate)) {
      days.push({
        id: startDate.format('YYYY-MM-DD'),
        date: startDate.format('D'),
        inMonth: startDate.isSameOrAfter(from) && startDate.isSameOrBefore(to),
        isSelected: selected?.find((date) => {
          return date.format('YYYY-MM-DD') === startDate.format('YYYY-MM-DD')
        })
        // data: rows.find((row) => {
        //   if (row.dayOfWeek.toLowerCase() === startDate.format('dddd').toLowerCase()) {
        //     return row.classes.filter((data: any) => {
        //       return moment(data.startDate).isSameOrBefore(startDate)
        //     })
        //   }
        // })
      })
      startDate.add(1, 'day')
    }
    return days
  }, [from, to, selected])

  const handleNextMonth = () => {
    setFrom(moment(from).add(1, 'month').startOf('month').format('YYYY-MM-DD'))
    setTo(moment(to).add(1, 'month').endOf('month').format('YYYY-MM-DD'))
  }
  const handlePrevMonth = () => {
    setFrom(moment(from).subtract(1, 'month').startOf('month').format('YYYY-MM-DD'))
    setTo(moment(to).subtract(1, 'month').endOf('month').format('YYYY-MM-DD'))
  }
  const handleCurrentMonth = () => {
    setFrom(moment().startOf('month').format('YYYY-MM-DD'))
    setTo(moment().endOf('month').format('YYYY-MM-DD'))
  }

  const renderEventDetails = () => {
    return <Typography>test</Typography>
  }
  const renderEventContent = (event: any) => {
    return <Typography>{event.date}</Typography>
  }

  return (
    <Box sx={{ borderRadius: '4px', border: `1px solid ${colors.grey[100]}`, paddingY: '16px', paddingX: '12px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1' fontWeight={'bold'}>
          Tháng {moment(from).format('MM, YYYY')}
        </Typography>
        <ButtonGroup size='small' color='primary'>
          <Button
            onClick={() => {
              handlePrevMonth()
            }}
          >
            <NavigateBeforeIcon />
          </Button>
          <Button
            onClick={() => {
              handleNextMonth()
            }}
          >
            <NavigateNextIcon />
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        sx={{
          overflow: 'auto',
          '&::-webkit-scrollbar': { height: '10px' },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888'
          },

          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {INITIAL_COLUMNS.map((column) => (
                <TableCell key={column.id} sx={{ textAlign: 'center', color: colors.primary[900] }}>
                  <Box
                    sx={{
                      borderRadius: '100px',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {column.label}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: Math.ceil(daysOfMonth.length / 7) }, (_, index) => (
              <TableRow key={index}>
                {daysOfMonth.slice(index * 7, (index + 1) * 7).map((day) => (
                  <TableCell key={day.id} sx={{ border: 'none', opacity: day.inMonth ? 1 : 0.5 }}>
                    <Box
                      sx={{
                        backgroundColor: day.isSelected ? colors.primary[400] : '',
                        color: day.isSelected ? colors.primary[50] : '',
                        border: currentDay === day.id ? `1px solid ${colors.grey[200]}` : '',
                        borderRadius: '100px',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                          backgroundColor: colors.primary[50],
                          color: colors.primary[900],
                          cursor: 'pointer'
                        }
                      }}
                    >
                      {renderEventContent(day)}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Button
        onClick={() => {
          handleCurrentMonth()
        }}
      >
        Hôm nay
      </Button>
    </Box>
  )
}

export default MonthView

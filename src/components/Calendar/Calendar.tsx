import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import moment, { Moment } from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { tokens } from '~/themes/theme'
import { RoomCustomSchemaType } from '~/schemaValidations/room.schema'
import { SlotAvailable } from '~/constants/type'
import Loading from '../Progress/Loading'
import { useGetUnavailableRooms } from '~/queries/useFilterRoom'

const INITIAL_COLUMNS = [
  { id: 'sunday', label: 'CN' },
  { id: 'monday', label: 'T2' },
  { id: 'tuesday', label: 'T3' },
  { id: 'wednesday', label: 'T4' },
  { id: 'thursday', label: 'T5' },
  { id: 'friday', label: 'T6' },
  { id: 'saturday', label: 'T7' }
]

const Calendar = ({ selected, slots: selectedSlot }: { selected: Moment[]; slots: string[] }) => {
  const [from, setFrom] = useState(moment().startOf('month').format('YYYY-MM-DD'))
  const [to, setTo] = useState(moment().endOf('month').format('YYYY-MM-DD'))
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const currentDay = moment().format('YYYY-MM-DD')
  const {
    data: unavailableRooms,
    refetch: unavailableRoomsRefetch,
    isFetching
  } = useGetUnavailableRooms({
    startTime: selected[0]?.format('YYYY-MM-DDT00:01:00'),
    endTime: selected[selected.length - 1]?.format('YYYY-MM-DDT23:59:00')
  })

  useEffect(() => {
    unavailableRoomsRefetch()
  }, [selected, selectedSlot])

  const getData = ({ startDate }: { startDate: Moment }) => {
    const data: RoomCustomSchemaType[] = []
    unavailableRooms?.data.data.forEach((room) => {
      if (moment(room.startTime).format('YYYY-MM-DD') === startDate.format('YYYY-MM-DD')) {
        const slot: RoomCustomSchemaType = {
          roomId: room.roomId,
          roomName: room.name,
          slots: []
        }
        unavailableRooms?.data.data.forEach((s) => {
          if (moment(s.startTime).format('YYYY-MM-DD') === startDate.format('YYYY-MM-DD') && s.roomId === room.roomId) {
            const isAvailable = selectedSlot?.find((slot) => {
              // console.log('slot', slot)
              // console.log('test', `${moment(s.startTime).format('HH:mm')} - ${moment(s.endTime).format('HH:mm')}`)
              // console.log(slot === `${moment(s.startTime).format('HH:mm')} - ${moment(s.endTime).format('HH:mm')}`)
              return slot === `${moment(s.startTime).format('HH:mm')} - ${moment(s.endTime).format('HH:mm')}`
            })
            console.log(isAvailable)
            if (isAvailable) {
              slot.slots.push({
                startTime: s.startTime,
                endTime: s.endTime,
                available: false
              })
            }
          }
        })
        if (slot.slots.length !== 0) {
          data.push(slot)
        }
      }
    })
    return data
  }
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
        }),

        data: getData({ startDate: startDate })
      })
      startDate.add(1, 'day')
    }
    return days
  }, [from, to, selected, selectedSlot])

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

  const renderEventDetails = (event: any) => {
    return (
      <Box>
        {event.data.map((slot: RoomCustomSchemaType) => (
          <Box key={slot.roomId}>
            <Divider sx={{ opacity: 0.6 }} />
            <Typography variant='h6'>Phòng {slot.roomName}</Typography>
            <Grid container sx={{ width: '200px' }}>
              {slot.slots.map((s: SlotAvailable) => (
                <>
                  <Grid size={6}>
                    <Typography>
                      {moment(s.startTime).format('HH:mm')} - {moment(s.endTime).format('HH:mm')}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography color={s.available ? colors.success[200] : colors.error[400]}>
                      {s.available ? 'Còn chỗ' : 'Hết chỗ'}
                    </Typography>
                  </Grid>
                </>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    )
  }
  const renderEventContent = (event: {
    id: string
    date: string
    inMonth: boolean
    isSelected: moment.Moment | undefined
  }) => {
    return <Typography>{event.date}</Typography>
  }

  return (
    <Box
      sx={{
        borderRadius: '4px',
        border: `1px solid ${colors.grey[100]}`,
        position: 'relative'
      }}
    >
      <Loading loading={isFetching} />
      <Box sx={{ paddingY: '16px', paddingX: '12px' }}>
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
                      <Tooltip
                        placement='top'
                        disableHoverListener={day.data.length === 0 || !day.isSelected}
                        title={renderEventDetails(day)}
                        sx={{ display: 'none' }}
                      >
                        <Box
                          sx={{
                            backgroundColor:
                              day.data.length !== 0 && day.isSelected
                                ? colors.error[500]
                                : day.isSelected
                                  ? colors.primary[400]
                                  : '',
                            color: day.isSelected ? colors.primary[50] : '',
                            border: currentDay === day.id ? `1px solid ${colors.grey[200]}` : '',
                            borderRadius: '100px',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                              backgroundColor:
                                day.data.length !== 0 && day.isSelected ? colors.error[50] : colors.primary[50],
                              color: day.data.length !== 0 && day.isSelected ? colors.error[900] : colors.primary[900],
                              cursor: 'pointer'
                            }
                          }}
                        >
                          {renderEventContent(day)}
                        </Box>
                      </Tooltip>
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
    </Box>
  )
}

export default Calendar

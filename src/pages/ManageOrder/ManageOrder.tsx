import { useEffect, useState } from 'react'
import { GridColDef, GridToolbarContainer, GridValidRowModel } from '@mui/x-data-grid'
import {
  Chip,
  Select,
  MenuItem,
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Stack,
  InputAdornment
} from '@mui/material'
import Table from '~/components/Table/Table'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { Account, Order, OrderStatus } from '~/apis/orderApi'
import { useOrders, useSearchOrder, useStaffAccounts, useDeleteOrder } from '~/queries/useOrder'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import DeleteOrderModal from '~/components/AminManageOrder/DeleteOrderModal'
import ViewOrderModal from '~/components/AminManageOrder/ViewOrderModal'
import EditOrderModal from '~/components/AminManageOrder/EditOrderModal'
import CreateOrderModal from '~/components/AminManageOrder/CreateOrderModal'
import { mapOrderToRow } from '~/utils/order'
import { toast } from 'react-toastify'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { useAppContext } from '~/contexts/AppProvider'
import { Add } from '@mui/icons-material'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import SearchIcon from '@mui/icons-material/Search'
import envConfig from '~/constants/config'

export default function ManageOrder() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0
  })
  const { account } = useAppContext()
  const today = moment()
  const [selectedEndDate, setSelectedEndDate] = useState<Moment | null>(today)
  const [selectedStartDate, setSelectedStartDate] = useState<Moment | null>(today)
  const formattedStartDate = selectedStartDate?.startOf('day').format('YYYY-MM-DDTHH:mm') || ''
  const formattedEndDate = selectedEndDate?.endOf('day').format('YYYY-MM-DDTHH:mm') || ''
  const [status, setStatus] = useState<OrderStatus | null>(null)

  const [rowCount, setRowCount] = useState<number>()
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [staffList, setStaffList] = useState<Account[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [searchProcess, setSearchProcess] = useState<string>('')
  const theme = useTheme()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const [createMode, setCreateMode] = useState<boolean>(false)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<boolean>(false)
  const [deleteMode, setDeleteMode] = useState<boolean>(false)

  const socketCL = new SockJS(envConfig.VITE_SOCKET_URL)
  const client = Stomp.over(socketCL)

  const handleSelectedOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value === 'all' ? null : (event.target.value as OrderStatus)
    setStatus(value)
  }

  const deleteOrderMutation = useDeleteOrder()

  const handleDeleteOrder = () => {
    if (selectedOrder) {
      deleteOrderMutation.mutate(selectedOrder?.id, {
        onSuccess: (data) => {
          toast.success('Xóa đơn hàng ' + data + ' thành công')
        }
      })
    }
    setRows((prevRows) => prevRows.filter((row) => row.id !== selectedOrder?.id))
    setSelectedOrder(null)
    setDeleteMode(false)
  }

  const {
    data: orderData,
    error: orderError,
    refetch,
    isFetching
  } = useOrders({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    page: paginationModel.page,
    size: paginationModel.pageSize,
    status: status !== null ? status : undefined
  })
  const { data: searchData, isFetching: isSearchFetching } = useSearchOrder({
    keyword: searchKeyword,
    page: paginationModel.page,
    size: paginationModel.pageSize
  })
  const { data: staffData, error: staffError, isFetching: isStaffFetching } = useStaffAccounts()

  //client của thằng stomp khá dở nên mình sẽ chỉ run 1 lần thôi
  useEffect(() => {
    client.connect({}, () => {
      client.subscribe('/topic/payments', (data) => {
        const room = JSON.parse(data.body)
        const isAdminRole = account?.role === 'Admin'
        const isManagerOfBuilding =
          (account?.role === 'Manager' || account?.role === 'Staff') && account?.buildingNumber === room.buildingNumber
        if (isAdminRole || isManagerOfBuilding) {
          toast.success(`Phòng ${room.name} vừa được đặt`)
          refetch()
        }
      })
    })

    return () => {
      if (client.connected) {
        client.disconnect(() => {})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (orderData) {
      const rowsData = orderData.data.map(mapOrderToRow)
      setRows([...rowsData])
      setRowCount(orderData.totalRecord)
    }
  }, [orderData])

  useEffect(() => {
    if (searchKeyword.trim().length > 0) {
      if (searchData) {
        const searchRowsData = searchData.data.map(mapOrderToRow)
        setRows([...searchRowsData])
        setRowCount(searchData?.totalRecord || 0)
      }
    } else {
      if (orderData) {
        const rowsData = orderData.data.map(mapOrderToRow)
        setRows([...rowsData])
        setRowCount(orderData.totalRecord)
      }
    }
  }, [searchKeyword, orderData, searchData])

  useEffect(() => {
    if (staffData) setStaffList(staffData)
  }, [staffData])

  if (orderError || staffError) return <div>Error: {orderError?.message || staffError?.message}</div>

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 250,
      renderCell: (params) => <div style={{ paddingTop: '10px' }}>{params.value}</div>
    },
    {
      field: 'customer',
      headerName: 'Khách hàng',
      width: 200,
      renderCell: (params) => <div style={{ paddingTop: '10px' }}>{params.value}</div>
    },
    {
      field: 'address',
      headerName: 'Chi nhánh',
      width: 100,
      renderCell: (params) => <div style={{ paddingTop: '10px' }}>{params.value}</div>
    },
    {
      field: 'servicePackage',
      headerName: 'Gói dịch vụ',
      width: 150,
      renderCell: (params) => <div style={{ paddingTop: '10px' }}>{params.value}</div>
    },
    {
      field: 'roomName',
      headerName: 'Danh sách phòng',
      width: 200,
      renderCell: (params) => {
        const rooms = params.value ? params.value.split(',') : []

        return rooms.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              maxHeight: 80,
              overflow: 'hidden',
              width: '200px'
            }}
          >
            {rooms.map((room: string, index: number) => (
              <Chip color='default' variant='outlined' key={index} label={room.trim()} />
            ))}
          </Box>
        ) : (
          'N/A'
        )
      }
    },
    {
      field: 'slots',
      headerName: 'Khung giờ',
      width: 200,
      renderCell: (params) => (
        <Stack direction='column' spacing={1}>
          {params.value.split(', ').map((slot: string, index: number) => (
            <Chip key={index} label={slot.trim()} />
          ))}
        </Stack>
      )
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === OrderStatus.Pending
              ? 'primary'
              : params.value === OrderStatus.Successfully
                ? 'success'
                : 'error'
          }
        />
      )
    },
    {
      field: 'orderHandler',
      headerName: 'Nhân viên',
      width: 100,
      renderCell: (params) => {
        const handlers = params.value ? params.value.split(',') : [] // Tách chuỗi thành mảng

        return handlers.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              maxHeight: 70,
              overflow: 'hidden',
              width: '150px'
            }}
          >
            {handlers.map((handler: string, index: number) => (
              <Chip
                key={index}
                label={handler.trim()}
                sx={{
                  borderColor: theme.palette.primary.light,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  color: theme.palette.primary.light,
                  backgroundColor: 'transparent'
                }}
              />
            ))}
          </Box>
        ) : (
          <Chip
            label='Chưa có nhân viên'
            sx={{
              borderColor: theme.palette.error.light,
              borderWidth: 1,
              borderStyle: 'solid',
              color: theme.palette.error.light,
              backgroundColor: 'transparent'
            }}
          />
        )
      }
    },
    {
      field: 'updatedAt',
      headerName: 'Thời gian cập nhật',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', height: '100%' }}>
          <Typography variant='body2' color={theme.palette.grey[700]}>
            {params.value.substr(0, 5)}
          </Typography>
          <Typography variant='body2' color={theme.palette.grey[500]}>
            | {params.value.substr(6)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', height: '100%' }}>
          <Typography variant='body2' color={theme.palette.grey[700]}>
            {params.value.substr(0, 5)}
          </Typography>
          <Typography variant='body2' color={theme.palette.grey[500]}>
            | {params.value.substr(6)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', height: '100%' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
            onClick={() => {
              handleSelectedOrder(params.row.order)
              setViewMode(true)
            }}
          >
            <VisibilityIcon
              sx={{
                color: theme.palette.grey[500],
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.text.primary
                }
              }}
            />
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
            onClick={() => {
              handleSelectedOrder(params.row.order)
              setEditMode(true)
            }}
          >
            <EditNoteIcon
              sx={{
                color: theme.palette.grey[500],
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.text.primary
                }
              }}
            />
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
            onClick={() => {
              handleSelectedOrder(params.row.order)
              setDeleteMode(true)
            }}
          >
            <DeleteIcon
              sx={{
                color: theme.palette.grey[500],
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.text.primary
                }
              }}
            />
          </Box>
        </Box>
      )
    }
  ]

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(event.target.value)
    setSearchProcess(event.target.value)
    if (event.target.value.trim().length === 0) {
      setSearchKeyword('')
    }
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setSearchKeyword((event.target as HTMLInputElement).value)
    }
  }

  const Toolbar = () => (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
      <Button variant='text' color='primary' onClick={() => setCreateMode(true)} startIcon={<Add />}>
        Thêm đơn hàng
      </Button>
      <Box display='flex' gap={2} sx={{ marginTop: '5px' }}>
        <Box sx={{ width: '200px' }}>
          <DatePicker
            label='Từ'
            value={selectedStartDate}
            format={DEFAULT_DATE_FORMAT}
            onChange={(newValue) => setSelectedStartDate(newValue)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Box>
        <Box sx={{ width: '200px' }}>
          <DatePicker
            label='Đến'
            value={selectedEndDate}
            format={DEFAULT_DATE_FORMAT}
            onChange={(newValue) => setSelectedEndDate(newValue)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Box>
        <Box sx={{ width: '200px' }}>
          <FormControl fullWidth size='small' sx={{ minWidth: 220 }}>
            <InputLabel id='order-status-label'>Trạng thái đơn hàng</InputLabel>
            <Select
              labelId='order-status-label'
              value={status ?? 'all'}
              onChange={handleChange}
              label='Trạng thái đơn hàng'
            >
              <MenuItem value='all'>All</MenuItem>
              {Object.values(OrderStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '250px' }}></Box>
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box sx={{ width: '100%', height: 600 }}>
      <Typography variant='h5' sx={{ marginBottom: '10px' }}>
        Quản lý đơn hàng
      </Typography>
      <Box display='flex' justifyContent='flex-end' sx={{ width: '100%' }}>
        <Box sx={{ position: 'relative', width: '300px' }}>
          <TextField
            size='small'
            placeholder='Tìm kiếm...'
            onKeyDown={(event) =>
              handleSearchKeyDown(event as React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>)
            }
            value={searchProcess}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
                value: searchProcess
              }
            }}
            onChange={(event) => handleSearchChange(event)}
            sx={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              width: '220px',
              zIndex: 1
            }}
          />
        </Box>
      </Box>
      <Table
        columns={columns}
        rows={rows}
        loading={isFetching || isSearchFetching || isStaffFetching}
        setRows={setRows}
        toolbarComponents={Toolbar}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        totalRowCount={rowCount}
      />
      <CreateOrderModal open={createMode} onClose={() => setCreateMode(false)} refetch={refetch} />
      <ViewOrderModal open={viewMode} onClose={() => setViewMode(false)} order={selectedOrder} />
      <EditOrderModal
        open={editMode}
        onClose={() => setEditMode(false)}
        order={selectedOrder}
        staffList={staffList}
        refetch={refetch}
        setRows={setRows}
      />
      <DeleteOrderModal open={deleteMode} onClose={() => setDeleteMode(false)} onDelete={() => handleDeleteOrder()} />
    </Box>
  )
}

import { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter, GridValidRowModel } from '@mui/x-data-grid'
import {
  Chip,
  Select,
  MenuItem,
  Box,
  Typography,
  useTheme,
  Backdrop,
  CircularProgress,
  Button,
  TextField
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import {
  Account,
  Order,
  OrderStatus,
  useDeleteOrder,
  useOrders,
  useSearchOrder,
  useStaffAccounts,
  useUpdateStaff
} from '~/apis/orderApi'
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

export default function ManageOrder() {
  const { account } = useAppContext()
  const today = moment()
  const sevenDaysAgo = moment().subtract(7, 'days')
  const [selectedEndDate, setSelectedEndDate] = useState<Moment | null>(today)
  const [selectedStartDate, setSelectedStartDate] = useState<Moment | null>(sevenDaysAgo)
  const formattedStartDate = selectedStartDate?.startOf('day').format('YYYY-MM-DDTHH:mm') || ''
  const formattedEndDate = selectedEndDate?.endOf('day').format('YYYY-MM-DDTHH:mm') || ''

  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [rowCount, setRowCount] = useState<number>(0)
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [staffList, setStaffList] = useState<Account[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [searchProcess, setSearchProcess] = useState<string>('')
  const theme = useTheme()

  const [createMode, setCreateMode] = useState<boolean>(false)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<boolean>(false)
  const [deleteMode, setDeleteMode] = useState<boolean>(false)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const socketCL = new SockJS('http://localhost:8080/ws')
  const client = Stomp.over(socketCL)

  const handleSelectedOrder = (order: Order) => {
    setSelectedOrder(order)
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
    isLoading: isOrderLoading,
    error: orderError
  } = useOrders(formattedStartDate, formattedEndDate, currentPage, pageSize)
  const { data: searchData, isLoading: isSearchLoading } = useSearchOrder(searchKeyword, currentPage, pageSize)
  const { data: staffData, isLoading: isStaffLoading, error: staffError } = useStaffAccounts()
  const { mutate: updateStaff } = useUpdateStaff()

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
      const rowsData = orderData.data.data.map(mapOrderToRow)
      setRows([...rowsData])
      setRowCount(orderData.data.totalRecord)
    }
  }, [orderData])

  useEffect(() => {
    if (searchKeyword.trim().length > 0) {
      if (searchData) {
        const searchRowsData = searchData.data.data.map(mapOrderToRow)
        setRows([...searchRowsData])
        setRowCount(searchData?.data?.totalRecord || 0)
      }
    } else {
      if (orderData) {
        const rowsData = orderData.data.data.map(mapOrderToRow)
        setRows([...rowsData])
        setRowCount(orderData.data.totalRecord)
      }
    }
  }, [searchKeyword, orderData, searchData])

  useEffect(() => {
    if (staffData) setStaffList(staffData)
  }, [staffData])

  if (orderError || staffError) return <div>Error: {orderError?.message || staffError?.message}</div>

  const handleStaffChange = (orderId: string, newStaffId: string) => {
    const selectedStaff = staffList.find((s) => s.id === newStaffId)
    const request = {
      id: orderId,
      orderHandler: {
        id: newStaffId,
        name: selectedStaff?.name || '',
        orderHandler: selectedStaff
      }
    }
    updateStaff({ request })
    setRows((prevRows) => prevRows.map((row) => (row.id === orderId ? { ...row, staffId: newStaffId } : row)))
    toast.success('Cập nhật nhân viên thành công')
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'customer', headerName: 'Khách hàng', width: 200 },
    { field: 'roomName', headerName: 'Danh sách phòng', width: 200 },
    { field: 'slots', headerName: 'Khung giờ', width: 200 },
    { field: 'address', headerName: 'Chi nhánh', width: 100 },
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
      width: 200,
      renderCell: (params) => {
        const staffId = params.row?.staffId || null
        return (
          <Select
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '.MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
            value={staffId || ''}
            onChange={(e) => handleStaffChange(params.row.id, e.target.value)}
            fullWidth
            displayEmpty
            renderValue={(selected) => {
              let selectedStaff = staffList.find((staff) => staff.id === selected)
              if (!selectedStaff) selectedStaff = params.row?.orderHandler
              return selectedStaff ? selectedStaff.name : 'Chọn nhân viên'
            }}
          >
            <MenuItem value='' disabled>
              Chọn nhân viên
            </MenuItem>
            {staffList.map((staff) => (
              <MenuItem key={staff.id} value={staff.id}>
                {staff.name}
              </MenuItem>
            ))}
          </Select>
        )
      }
    },
    { field: 'servicePackage', headerName: 'Gói dịch vụ', width: 150 },
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
      <Box display='flex' gap={2} sx={{ marginTop: '5px' }}>
        <DatePicker
          label='Từ'
          value={selectedStartDate}
          onChange={(newValue) => setSelectedStartDate(newValue)}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
          label='Đến'
          value={selectedEndDate}
          onChange={(newValue) => setSelectedEndDate(newValue)}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </Box>
      <Box display='flex' gap={2}>
        <GridToolbarQuickFilter
          value={searchProcess}
          onChange={(event) => handleSearchChange(event)}
          sx={{
            '& .MuiInputBase-input': {
              color: 'white'
            }
          }}
        />
        <Button variant='contained' color='primary' onClick={() => setCreateMode(true)}>
          Thêm đơn hàng
        </Button>
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box sx={{ width: '100%', height: 600 }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isOrderLoading || isStaffLoading || isSearchLoading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Typography variant='h5' sx={{ marginBottom: '10px' }}>
        Quản lý đơn hàng
      </Typography>
      <Box display='flex' justifyContent='flex-end' sx={{ width: '100%' }}>
        <Box sx={{ position: 'relative', width: '250px' }}>
          <TextField
            label=''
            size='small'
            onKeyDown={(event) =>
              handleSearchKeyDown(event as React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>)
            }
            value={searchProcess}
            onChange={(event) => handleSearchChange(event)}
            sx={{
              position: 'absolute',
              top: '20px',
              right: '170px',
              width: '180px',
              zIndex: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none'
                },
                '&:hover fieldset': {
                  border: 'none'
                },
                '&.Mui-focused fieldset': {
                  border: 'none'
                }
              }
            }}
          />
        </Box>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={{ page: currentPage, pageSize: pageSize }}
        pageSizeOptions={[5, 10]}
        pagination
        paginationMode='server'
        rowCount={rowCount}
        onPaginationModelChange={(newPaginationModel) => {
          setCurrentPage(newPaginationModel.page)
          setPageSize(newPaginationModel.pageSize)
        }}
        slots={{ toolbar: Toolbar }}
      />
      <CreateOrderModal open={createMode} onClose={() => setCreateMode(false)} />
      <ViewOrderModal open={viewMode} onClose={() => setViewMode(false)} order={selectedOrder} />
      <EditOrderModal
        open={editMode}
        onClose={() => setEditMode(false)}
        order={selectedOrder}
        setOrders={setRows}
        staffList={staffList}
      />
      <DeleteOrderModal open={deleteMode} onClose={() => setDeleteMode(false)} onDelete={() => handleDeleteOrder()} />
    </Box>
  )
}

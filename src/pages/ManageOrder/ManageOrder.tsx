import { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter, GridValidRowModel } from '@mui/x-data-grid'
import { Chip, Select, MenuItem, Box, Typography, useTheme, Backdrop, CircularProgress, Button } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { Order, OrderStatus, useOrders } from '~/apis/orderApi'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import DeleteOrderModal from '~/components/AminManageOrder/DeleteOrderModal'
import ViewOrderModal from '~/components/AminManageOrder/ViewOrderModal'
import EditOrderModal from '~/components/AminManageOrder/EditOrderModal'
import CreateOrderModal from '~/components/AminManageOrder/CreateOrderModal'

const staffList = [
  { id: 1, name: 'Staff A' },
  { id: 2, name: 'Staff B' },
  { id: 3, name: 'Staff C' }
]

export default function ManageOrder() {
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
  const theme = useTheme()

  const [createMode, setCreateMode] = useState<boolean>(false)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<boolean>(false)
  const [deleteMode, setDeleteMode] = useState<boolean>(false)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const handleSelectedOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleDeleteOrder = () => {
    console.log(`Deleting order with ID: ${selectedOrder?.id}`)
    setRows((prevRows) => prevRows.filter((row) => row.id !== selectedOrder?.id))
    setSelectedOrder(null)
    setDeleteMode(false)
  }

  const { data, error, isLoading } = useOrders(formattedStartDate, formattedEndDate, currentPage, pageSize)
  useEffect(() => {
    if (data) {
      const rowsData = data?.data.map((order: Order) => ({
        order: order,
        id: order.id,
        customer: order.orderDetails?.[0]?.customer?.name || 'N/A',
        createdAt: moment(order.createdAt).format('HH:mm' + '  ' + 'DD-MM-YY') || 'N/A',
        updatedAt: moment(order.updatedAt).format('HH:mm' + '  ' + 'DD-MM-YY') || 'N/A',
        roomName: order.orderDetails.map((o) => o.roomName).join(', ') || 'N/A',
        address: order.orderDetails?.[0]?.buildingAddress || 'N/A',
        status: order.orderDetails?.[0]?.status || 'N/A',
        startTime: moment(order.orderDetails?.[0]?.startTime).format('HH:mm DD-MM') || 'N/A',
        endTime: new Date(order.orderDetails?.[0]?.endTime).toLocaleString() || 'N/A',
        servicePackage: order.orderDetails?.[0]?.servicePackage?.name || 'N/A',
        orderHandler: order.orderDetails[0]?.orderHandler || null,
        staffId: order.orderDetails[0]?.orderHandler?.id || null
      }))
      setRows([...rowsData].reverse())
      setRowCount(data?.totalElements)
    }
  }, [data])

  if (error) return <div>Error: {error.message}</div>

  const handleStaffChange = (orderId: string, newStaffId: number) => {
    console.log(`Order ID: ${orderId}, New Staff ID: ${newStaffId}`)
    setRows((prevRows) => prevRows.map((row) => (row.id === orderId ? { ...row, staffId: newStaffId } : row)))
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'customer', headerName: 'Khách hàng', width: 200 },
    { field: 'roomName', headerName: 'Danh sách phòng', width: 200 },
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
            value={staffId}
            onChange={(e) => handleStaffChange(params.row.id, e.target.value as number)}
            fullWidth
            displayEmpty
            renderValue={(selected) => {
              let selectedStaff = staffList.find((staff) => staff.id === selected)
              if (!selectedStaff) selectedStaff = params.row.orderHandler
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
        <GridToolbarQuickFilter />
        <Button variant='contained' color='primary' onClick={() => setCreateMode(true)}>
          Thêm đơn hàng
        </Button>
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box sx={{ width: '100%', height: 600 }}>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Typography variant='h5' sx={{ marginBottom: '10px' }}>
        Quản lý đơn hàng
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={{ page: currentPage, pageSize: pageSize }}
        pageSizeOptions={[5, 10, 20]}
        pagination
        paginationMode='server'
        rowCount={rowCount}
        onPaginationModelChange={(newPaginationModel) => {
          setCurrentPage(newPaginationModel.page)
          setPageSize(newPaginationModel.pageSize)
        }}
        slots={{ toolbar: Toolbar }}
      />
      <CreateOrderModal open={createMode} onClose={() => setCreateMode(false)} setOrders={setRows} />
      <ViewOrderModal open={viewMode} onClose={() => setViewMode(false)} order={selectedOrder} />
      <EditOrderModal open={editMode} onClose={() => setEditMode(false)} order={selectedOrder} setOrders={setRows} />
      <DeleteOrderModal open={deleteMode} onClose={() => setDeleteMode(false)} onDelete={() => handleDeleteOrder()} />
    </Box>
  )
}

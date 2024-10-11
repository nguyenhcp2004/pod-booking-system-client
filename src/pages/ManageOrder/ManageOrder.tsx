import { useEffect, useState } from 'react'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridValidRowModel
} from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import FilterListIcon from '@mui/icons-material/FilterList'
import EditOrderModal from '~/components/AminManageOrder/EditOrderModal'
import DeleteOrderModal from '~/components/AminManageOrder/DeleteOrderModal'
import ViewOrderModal from '~/components/AminManageOrder/ViewOrderModal'
import CreateOrderModal from '~/components/AminManageOrder/CreateOrderModal'
import { toast } from 'react-toastify'
import { Chip, Button, Box, Typography, Menu, MenuItem, useTheme } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { Order, OrderStatus, useOrders } from '~/apis/orderApi'

export default function ManageOrder() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)

  const today = moment()
  const sevenDaysAgo = moment().subtract(7, 'days')
  const [selectedEndDate, setSelectedEndDate] = useState<Moment | null>(today)
  const [selectedStartDate, setSelectedStartDate] = useState<Moment | null>(sevenDaysAgo)
  const formattedStartDate = selectedStartDate?.startOf('day').format('YYYY-MM-DDTHH:mm') || ''
  const formattedEndDate = selectedEndDate?.endOf('day').format('YYYY-MM-DDTHH:mm') || ''
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [rowCount, setRowCount] = useState(0)

  const { data, error, isLoading } = useOrders(formattedStartDate, formattedEndDate, currentPage + 1, pageSize)

  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const theme = useTheme()
  useEffect(() => {
    if (data) {
      console.log(data)
      const rowsData = data?.data.map((order: Order) => ({
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
        orderHandler: order.orderDetails?.[0]?.orderHandler?.name || 'N/A'
      }))
      setRows([...rowsData].reverse())
      setRows(rowsData)
      setRowCount(data?.totalElements)
    }
  }, [data])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(0)
  }

  const handlePaginationChange = (newPaginationModel) => {
    setCurrentPage(newPaginationModel.page)
    setPageSize(newPaginationModel.pageSize)
  }

  const [filterValues, setFilterValues] = useState<{ [key: string]: string[] }>({
    status: [],
    room: []
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const handleFilterClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleFilterChange = (column: string, value: string) => {
    const currentValues = filterValues[column]
    if (currentValues.includes(value)) {
      setFilterValues({ ...filterValues, [column]: currentValues.filter((v) => v !== value) })
    } else {
      setFilterValues({ ...filterValues, [column]: [...currentValues, value] })
    }
  }

  const filteredRows = rows.filter(() => {
    return true
  })

  const handleEditClick = (rowSelected: GridValidRowModel) => () => {
    setSelectedOrder(rowSelected as Order)
    setOpenEditModal(true)
  }

  const handleDeleteClick = (rowSelected: GridValidRowModel) => () => {
    setSelectedOrder(rowSelected as Order)
    setOpenDeleteModal(true)
  }

  const handleViewClick = (rowSelected: GridValidRowModel) => () => {
    setSelectedOrder(rowSelected as Order)
    setOpenViewModal(true)
  }

  const handleDeleteOrder = (id: GridRowId) => {
    setRows(rows.filter((row) => row.id !== id))
    toast.success('Đơn hàng đã được xóa thành công')
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'customer', headerName: 'Khách hàng', width: 200 },
    { field: 'roomName', headerName: 'Danh sách phòng', width: 150 },
    { field: 'address', headerName: 'Chi nhánh', width: 200 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      renderHeader: (params) => (
        <Box display='flex' alignItems='center'>
          <span>{params.colDef.headerName}</span>
          <FilterListIcon onClick={(e) => handleFilterClick(e)} style={{ cursor: 'pointer', marginLeft: 8 }} />
        </Box>
      ),
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
    { field: 'orderHandler', headerName: 'Nhân viên', width: 150 },
    { field: 'servicePackage', headerName: 'Gói dịch vụ', width: 150 },
    {
      field: 'updatedAt',
      headerName: 'Thời gian cập nhật',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
      field: 'actions',
      type: 'actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label='Edit' onClick={handleEditClick(params.row)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(params.row)} />,
        <GridActionsCellItem icon={<RemoveRedEyeIcon />} label='View' onClick={handleViewClick(params.row)} />
      ]
    }
  ]

  const Toolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <Box display='flex' gap={2}>
          <GridToolbarQuickFilter />
          <Button variant='contained' color='primary' onClick={() => setOpenCreateModal(true)}>
            Thêm đơn hàng
          </Button>
        </Box>
        <Box display='flex' gap={2}>
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
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ width: '100%', height: 600 }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        paginationModel={{ page: currentPage, pageSize: pageSize }} // Sử dụng paginationModel để quản lý trạng thái
        pageSizeOptions={[5, 10, 20]}
        pagination
        paginationMode='server'
        rowCount={rowCount}
        onPaginationModelChange={(newPaginationModel) => {
          setCurrentPage(newPaginationModel.page) // Cập nhật trang hiện tại
          setPageSize(newPaginationModel.pageSize) // Cập nhật kích thước trang
        }}
      />
      {/* components={{ Toolbar }} */}
      {/* <EditOrderModal open={openEditModal} setOpen={setOpenEditModal} selectedOrder={selectedOrder} />
      <DeleteOrderModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        selectedOrder={selectedOrder}
        onDelete={handleDeleteOrder}
      />
      <ViewOrderModal open={openViewModal} setOpen={setOpenViewModal} selectedOrder={selectedOrder} />
      <CreateOrderModal open={openCreateModal} setOpen={setOpenCreateModal} /> */}
    </Box>
  )
}

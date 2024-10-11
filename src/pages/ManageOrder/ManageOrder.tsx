import { useState } from 'react'
import {
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
import Table from '~/components/Table/Table'
import EditOrderModal from '~/components/AminManageOrder/EditOrderModal'
import DeleteOrderModal from '~/components/AminManageOrder/DeleteOrderModal'
import ViewOrderModal from '~/components/AminManageOrder/ViewOrderModal'
import CreateOrderModal from '~/components/AminManageOrder/CreateOrderModal'
import { toast } from 'react-toastify'
import { Chip, Button, Box, Typography, Menu, MenuItem } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'

interface Order {
  id: string
  customerName: string
  date: string
  slot: string
  room: string
  address: string
  status: string
  staff: string
  servicePackage: string
}

export default function ManageOrder() {
  const sampleOrders: Order[] = [
    {
      id: 'ORD12345',
      customerName: 'Nguyễn Văn A',
      date: '2024-10-01',
      slot: '09:00 - 11:00',
      room: 'Room A',
      address: '123 Main St.',
      status: 'Active',
      staff: 'John Doe',
      servicePackage: 'Cơ bản'
    },
    {
      id: 'ORD12345',
      customerName: 'Nguyễn Văn A',
      date: '2024-10-01',
      slot: '09:00 - 11:00',
      room: 'Room A',
      address: '123 Main St.',
      status: 'Active',
      staff: 'John Doe',
      servicePackage: 'Cơ bản'
    },
    {
      id: 'ORD12346',
      customerName: 'Trần Thị B',
      date: '2024-10-02',
      slot: '13:00 - 15:00',
      room: 'Room B',
      address: '456 Elm St.',
      status: 'Hủy bỏ',
      staff: 'Jane Smith',
      servicePackage: 'Nâng cao'
    },
    {
      id: 'ORD12347',
      customerName: 'Lê Văn C',
      date: '2024-10-03',
      slot: '11:00 - 13:00',
      room: 'Room C',
      address: '789 Pine St.',
      status: 'Active',
      staff: 'Alice Johnson',
      servicePackage: 'Tiêu chuẩn'
    },
    {
      id: 'ORD12348',
      customerName: 'Phạm Thị D',
      date: '2024-10-04',
      slot: '15:00 - 17:00',
      room: 'Room D',
      address: '321 Maple St.',
      status: 'Canceled',
      staff: 'Bob Brown',
      servicePackage: 'Nâng cao'
    },
    {
      id: 'ORD12349',
      customerName: 'Nguyễn Thị E',
      date: '2024-10-05',
      slot: '10:00 - 12:00',
      room: 'Room E',
      address: '654 Oak St.',
      status: 'Active',
      staff: 'Eve White',
      servicePackage: 'Cơ bản'
    }
  ]

  const [rows, setRows] = useState<Order[]>(sampleOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const today = moment()
  const sevenDaysAgo = moment().subtract(7, 'days')
  const [selectedEndDate, setSelectedEndDate] = useState<Moment | null>(today)
  const [selectedStartDate, setSelectedStartDate] = useState<Moment | null>(sevenDaysAgo)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [filterValues, setFilterValues] = useState<{ [key: string]: string[] }>({
    status: [],
    room: []
  })

  const handleFilterClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    //column: string
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

  const filteredRows = rows.filter((row) => {
    if (filterValues.status.length > 0 && !filterValues.status.includes(row.status)) {
      return false
    }
    if (filterValues.room.length > 0 && !filterValues.room.includes(row.room)) {
      return false
    }
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
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'customerName', headerName: 'Khách hàng', width: 200 },
    { field: 'date', headerName: 'Ngày', width: 150 },
    { field: 'slot', headerName: 'Thời gian', width: 150 },
    { field: 'room', headerName: 'Phòng', width: 150 },
    { field: 'address', headerName: 'Địa chỉ', width: 200 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      renderHeader: (params) => (
        <Box display='flex' alignItems='center'>
          <span>{params.colDef.headerName}</span>
          <FilterListIcon
            onClick={(e) => handleFilterClick(e)} // 'status'
            style={{ cursor: 'pointer', marginLeft: 8 }}
          />
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Active' ? 'success' : params.value === 'Bảo trì' ? 'warning' : 'error'}
        />
      )
    },
    { field: 'staff', headerName: 'Nhân viên', width: 150 },
    { field: 'servicePackage', headerName: 'Gói dịch vụ', width: 150 },
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
        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
          <DatePicker
            label='Ngày bắt đầu'
            value={selectedStartDate}
            onChange={(date) => setSelectedStartDate(date)}
            slotProps={{ textField: { size: 'small' } }}
            format={DEFAULT_DATE_FORMAT}
          />
          <DatePicker
            label='Ngày kết thúc'
            value={selectedEndDate}
            onChange={(date) => setSelectedEndDate(date)}
            slotProps={{ textField: { size: 'small' } }}
            format={DEFAULT_DATE_FORMAT}
          />
        </Box>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='flex-end' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí đơn hàng
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => setOpenCreateModal(true)}
          style={{ marginTop: '20px' }}
        >
          Tạo đơn hàng
        </Button>
      </Box>
      <Table columns={columns} rows={filteredRows} toolbarComponents={Toolbar} />

      {/* Thêm menu lọc */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleFilterChange('status', 'Active')}>Active</MenuItem>
        <MenuItem onClick={() => handleFilterChange('status', 'Hủy bỏ')}>Hủy bỏ</MenuItem>
        <MenuItem onClick={() => handleFilterChange('status', 'Canceled')}>Canceled</MenuItem>
      </Menu>

      <EditOrderModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        order={selectedOrder}
        setOrders={setRows}
      />
      <DeleteOrderModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => selectedOrder && handleDeleteOrder(selectedOrder.id)}
      />
      <ViewOrderModal open={openViewModal} onClose={() => setOpenViewModal(false)} order={selectedOrder} />
      <CreateOrderModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} setOrders={setRows} />
    </Box>
  )
}

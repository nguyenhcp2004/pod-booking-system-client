import React, { useState } from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip,
  Grid,
  TableBody,
  TextField,
  Box
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SortIcon from '@mui/icons-material/Sort' // Import icon sort
import moment, { Moment } from 'moment'
import { DatePicker } from '@mui/x-date-pickers-pro'
import EditOrderModal from '~/components/AminManageOrder/EditOrderModal'
import DeleteOrderModal from '~/components/AminManageOrder/DeleteOrderModal'
import CreateOrderModal from '~/components/AminManageOrder/CreateOrderModal'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import ViewOrderModal from '~/components/AminManageOrder/ViewOrderModal'

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

const ManageOrder = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD12345',
      customerName: 'Nguyễn Văn A',
      date: '2024-10-01',
      slot: '09:00 - 11:00',
      room: 'Room A',
      address: '123 Main St.',
      status: 'Hoạt động',
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
    }
  ])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)

  const today = moment()
  const sevenDaysAgo = moment().subtract(7, 'days')
  const [selectedEndDate, setSelectedEndDate] = useState<Moment | null>(today)
  const [selectedStartDate, setSelectedStartDate] = useState<Moment | null>(sevenDaysAgo)
  const [openViewModal, setOpenViewModal] = useState(false)

  const [sortColumn, setSortColumn] = useState<keyof Order | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const sortOrders = (column: keyof Order) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    const sortedOrders = [...orders].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return newDirection === 'asc' ? 1 : -1
      return 0
    })
    setOrders(sortedOrders)
    setSortColumn(column)
    setSortDirection(newDirection)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setAnchorEl(event.currentTarget)
    setSelectedOrder(order)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedOrder(null)
  }

  const handleDelete = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id))
    handleMenuClose()
    setOpenDeleteModal(false)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOpenViewModal(true) // Mở modal chi tiết
  }

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'Hoạt động':
        return 'primary'
      case 'Hủy bỏ':
        return 'error'
      case 'Hoàn thành':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={2} alignItems='center' justifyContent='space-between'>
        <Grid item lg={6}>
          <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
            <DatePicker
              label='Ngày bắt đầu'
              value={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              slotProps={{ textField: { size: 'small' } }} //, fullWidth: true
              format={DEFAULT_DATE_FORMAT}
            />
            <DatePicker
              label='Ngày kết thúc'
              value={selectedEndDate}
              onChange={(date) => setSelectedEndDate(date)}
              slotProps={{ textField: { size: 'small' } }} //fullWidth: true
              format={DEFAULT_DATE_FORMAT}
            />
          </Box>
        </Grid>
        <Grid item lg={6}>
          <Box sx={{ width: '100%' }} display='flex' justifyContent='flex-end' gap='10px'>
            <TextField label='Tìm kiếm ID đơn hàng' variant='outlined' size='small' />
            <Button variant='contained' onClick={() => setOpenCreateModal(true)}>
              Tạo đơn hàng
            </Button>
          </Box>
        </Grid>
      </Grid>

      <TableContainer sx={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <span>ID</span>
                <IconButton onClick={() => sortOrders('id')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <span>Ngày</span>
                <IconButton onClick={() => sortOrders('date')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <span>Slot</span>
                <IconButton onClick={() => sortOrders('slot')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <span>Phòng</span>
                <IconButton onClick={() => sortOrders('room')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <span>Địa chỉ</span>
                <IconButton onClick={() => sortOrders('address')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <span>Trạng thái</span>
                <IconButton onClick={() => sortOrders('status')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <span>Nhân viên</span>
                <IconButton onClick={() => sortOrders('staff')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <span>Gói dịch vụ</span>
                <IconButton onClick={() => sortOrders('servicePackage')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell
                  onClick={() => handleViewOrder(order)}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  {order.id}
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.slot}</TableCell>
                <TableCell>{order.room}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>
                  <Chip label={order.status} color={getStatusChipColor(order.status)} />
                </TableCell>
                <TableCell>{order.staff}</TableCell>
                <TableCell>{order.servicePackage}</TableCell>
                <TableCell>
                  <IconButton
                    aria-controls={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup='true'
                    onClick={(event) => handleMenuOpen(event, order)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem
                      onClick={() => {
                        setOpenEditModal(true)
                        handleMenuClose()
                      }}
                    >
                      Chỉnh sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setOpenDeleteModal(true)
                        handleMenuClose()
                      }}
                    >
                      Xóa
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditOrderModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        order={selectedOrder}
        setOrders={setOrders}
      />

      {/* Modal xóa đơn hàng */}
      <DeleteOrderModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => selectedOrder && handleDelete(selectedOrder.id)}
      />

      <ViewOrderModal open={openViewModal} onClose={() => setOpenViewModal(false)} order={selectedOrder} />

      {/* Modal tạo đơn hàng */}
      <CreateOrderModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} setOrders={setOrders} />
    </div>
  )
}

export default ManageOrder

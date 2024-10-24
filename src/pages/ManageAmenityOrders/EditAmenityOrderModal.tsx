import { Cancel, CheckCircle, Done, Edit } from '@mui/icons-material'
import { Box, Chip, Dialog, IconButton, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { GridColDef } from '@mui/x-data-grid'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Table from '~/components/Table/Table'
import { AMENITY_ORDER_STATUS } from '~/constants/mock'
import { useUpdateAmenityOrder } from '~/queries/useOrderDetailAmenity'
import { AmenityOrderType, OrderDetailAmenityType } from '~/schemaValidations/amenityOrder.schema'
import { tokens } from '~/themes/theme'
import { formatCurrency } from '~/utils/currency'

const EditAmenityOrderModal = ({
  row,
  refetch,
  open,
  handleClose
}: {
  row: OrderDetailAmenityType
  refetch: () => void
  open: boolean
  handleClose: () => void
}) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const editAmenityOrder = useUpdateAmenityOrder()

  const handleUpdate = ({ row, status }: { row: AmenityOrderType; status: 'Booked' | 'Delivered' | 'Canceled' }) => {
    const payload = {
      id: row?.id,
      status: status
    }
    editAmenityOrder.mutateAsync(payload).then(() => {
      toast.success('Cập nhật trạng thái đơn hàng thành công')
      refetch()
    })
    handleClose()
  }
  const columns: GridColDef[] = [
    { field: 'rowId', headerName: 'ID', width: 50 },
    { field: 'amenityName', headerName: 'Tên', width: 200 },
    { field: 'quantity', headerName: 'Số lượng', width: 150 },
    {
      field: 'price',
      headerName: 'Giá',
      width: 150,
      valueFormatter: (params) => {
        return formatCurrency(params as number)
      }
    },
    {
      field: 'total',
      headerName: 'Tổng',
      width: 150,
      valueGetter: (_, row) => {
        return formatCurrency(row.quantity * row.price)
      }
    },
    {
      field: 'status',
      headerName: 'Trạng thái',

      type: 'singleSelect',
      editable: true,
      valueOptions: Object.entries(AMENITY_ORDER_STATUS).map(([_, value]) => value),
      valueGetter: (_, row) => {
        return { status: row.status, statusDescription: row.statusDescription }
      },
      renderCell: (params) =>
        params.value.status ? (
          <Chip
            label={params.value.statusDescription as string}
            color={
              params.value.status === AMENITY_ORDER_STATUS.BOOKED
                ? 'default'
                : params.value.status === AMENITY_ORDER_STATUS.DELIVERED
                  ? 'success'
                  : 'error'
            }
          />
        ) : null
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 200,
      valueFormatter: (params) => {
        return params && moment(params).format('DD/MM/YYYY HH:mm')
      }
    },
    {
      field: 'updatedAt',
      headerName: 'Ngày cập nhật',
      width: 200,
      valueFormatter: (params) => {
        return params && moment(params).format('DD/MM/YYYY HH:mm')
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ row }) => {
        return [
          <Box sx={{ display: 'flex' }}>
            <IconButton
              onClick={() => {
                handleUpdate({ row, status: 'Delivered' })
              }}
              color='success'
            >
              <CheckCircle />
            </IconButton>
            <IconButton
              onClick={() => {
                handleUpdate({ row, status: 'Canceled' })
              }}
              color='error'
            >
              <Cancel />
            </IconButton>
          </Box>
        ]
      }
    }
  ]
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          sx: {
            position: 'relative',
            background: colors.grey[50],
            minWidth: 1200,
            display: 'flex',
            padding: '16px'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            padding: '16px',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <Typography variant='h4' fontWeight='500' flexGrow={1}>
            Chi tiết đơn hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant='h6' fontWeight='500'>
                Mã đơn hàng: {row?.id}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant='h6' fontWeight='500'>
                Tên khách hàng: {row?.customerName}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant='h6' fontWeight='500'>
                Địa chỉ: {row?.buildingAddress}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant='h6' fontWeight='500'>
                Phòng: {row?.roomName} - {row?.roomId}
              </Typography>
            </Grid>
          </Grid>
          <Table columns={columns} rows={row.orderDetailAmenities} totalRowCount={row.orderDetailAmenities.length} />
        </Box>
      </Dialog>
    </Box>
  )
}

export default EditAmenityOrderModal

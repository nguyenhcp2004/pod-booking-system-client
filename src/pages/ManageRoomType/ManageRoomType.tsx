import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material'
import { GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useGetFilterRoomType } from '~/queries/useFilterRoomType'
import RoomTypeModal from './RoomTypeModal'
import { ACTION } from '~/constants/mock'
import Table from '~/components/Table/Table'
import { Building, RoomTypeFix } from '~/constants/type'
import { useDeleteRoomType } from '~/queries/useRoomType'
import DeleteIcon from '@mui/icons-material/Delete'

export default function RoomType() {
  const [rows, setRows] = useState<RoomTypeFix[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [selectedRow, setSelectedRow] = useState<RoomTypeFix | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const { data, isFetching, refetch } = useGetFilterRoomType({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize
  })

  const deleteRoomMutation = useDeleteRoomType()

  useEffect(() => {
    if (data?.data.data) {
      console.log(data.data.data[0].price)
      setRows(data.data.data)
    }
  }, [data])

  const handleDelete = async () => {
    if (!selectedRow) return

    if (selectedRow.quantity > 0) {
      alert('Không thể xóa loại phòng có số lượng phòng lớn hơn 0')
      setOpenConfirm(false)
      return
    }
    try {
      await deleteRoomMutation.mutateAsync(selectedRow.id)
      refetch()
      setOpenConfirm(false)
    } catch (error) {
      console.error('Error deleting room type:', error)
    }
  }

  const confirmDelete = (row: RoomTypeFix) => {
    setSelectedRow(row)
    setOpenConfirm(true)
  }

  const totalRowCount = data?.data.totalRecord || 0

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Tên', width: 250 },
    {
      field: 'price',
      headerName: 'Giá',
      width: 150,
      valueGetter: (params: number) => {
        if (params == 0) {
          const price = 0
          return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        }
        return params ? params.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'
      }
    },
    { field: 'quantity', headerName: 'Số lượng phòng', width: 150, valueGetter: (params: number) => params + ' phòng' },
    { field: 'capacity', headerName: 'Sức chứa', width: 100, valueGetter: (params: number) => params + ' khách' },
    {
      field: 'building',
      headerName: 'Chi nhánh',
      width: 200,
      valueGetter: (params: Building) => params?.address || 'N/A'
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 100,
      renderCell: (params) => (
        <>
          <RoomTypeModal row={params.row} refetch={refetch} action={ACTION.UPDATE} />
          <IconButton onClick={() => confirmDelete(params.row)} color='error'>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ]

  const Toolbar = () => (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <RoomTypeModal
        row={{
          id: 0,
          name: '',
          price: 0,
          quantity: 0,
          capacity: 0,
          building: {
            address: '',
            status: '',
            id: 0,
            description: '',
            hotlineNumber: '',
            createdAt: '',
            updatedAt: ''
          }
        }}
        refetch={refetch}
        action={ACTION.CREATE}
      />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí loại phòng
        </Typography>
      </Box>

      {isFetching ? (
        <CircularProgress />
      ) : (
        <Table
          columns={columns}
          rows={rows}
          loading={isFetching}
          toolbarComponents={Toolbar}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          totalRowCount={totalRowCount}
        />
      )}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa loại phòng này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color='primary'>
            Hủy
          </Button>
          <Button onClick={handleDelete} color='error' autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

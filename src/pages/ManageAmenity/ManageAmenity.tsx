import { useGetListAmenity } from '~/queries/useAmenity'
import { AmenityTypeEnum } from '~/schemaValidations/amenity.schema'
import {
  Box,
  Button,
  Chip,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
  DialogActions,
  DialogContentText,
  Dialog
} from '@mui/material'
import { GridActionsCellItem, GridColDef, GridRowId, GridToolbarContainer, GridValidRowModel } from '@mui/x-data-grid'
import { useEffect, useRef, useState } from 'react'
import Table from '~/components/Table/Table'
import AmenityModal from '~/pages/ManageAmenity/AmenityModal'
import { ACTION } from '~/constants/mock'
import BlockIcon from '@mui/icons-material/Block'
import { toast } from 'react-toastify'
import { handleErrorApi } from '~/utils/utils'
import { useDeleteAmenityMutation } from '~/queries/useAmenity'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import moment from 'moment'
import SearchForManage from '~/components/SearchInput/SearchForManage'
import { PaginationSearchQuery } from '~/constants/type'

export default function ManageBuilding() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  })
  const [paginationFilter, setPaginationFilter] = useState({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize,
    searchParams: ''
  })
  const { data, isLoading } = useGetListAmenity(paginationFilter as PaginationSearchQuery)
  const editedRowRef = useRef<{ [id: GridRowId]: GridValidRowModel }>({})
  const theme = useTheme()
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>()
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: '', newStatus: '' })

  useEffect(() => {
    if (data) {
      setRows([...data.data.data])
      setTotalRowCount(data.data.totalRecord)
    }
  }, [data])

  const deleteAmenityMutation = useDeleteAmenityMutation()

  useEffect(() => {
    if (data?.data.data) {
      setRows(
        data.data.data.map((amenity, index) => ({
          ...amenity,
          sequentialIndex: index + 1,
          status: amenity.isDeleted === 0 ? 'Hoạt động' : 'Không hoạt động'
        }))
      )
      setTotalRowCount(data.data.totalRecord)
    }
  }, [data])

  useEffect(() => {
    setPaginationFilter((prevFilter) => ({
      ...prevFilter,
      page: paginationModel.page + 1,
      take: paginationModel.pageSize
    }))
  }, [paginationModel])

  const handleToggleStatus = (id: GridRowId) => async () => {
    const rowToToggle = rows.find((row) => row.id === id)
    if (rowToToggle) {
      const newStatus = rowToToggle.status === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động'
      try {
        setConfirmDialog({ open: true, id: id as string, newStatus })
      } catch (error) {
        handleErrorApi({ error })
        toast.error('Có lỗi xảy ra khi xóa dịch vụ', {
          autoClose: 3000
        })
      }
    }
  }
  const handleConfirmToggle = async () => {
    const { id, newStatus } = confirmDialog
    const rowToToggle = rows.find((row) => row.id === id)
    if (rowToToggle) {
      try {
        await deleteAmenityMutation.mutateAsync(rowToToggle.id)

        toast.success(`Trạng thái của dịch vụ ${rowToToggle.name} đã được cập nhật thành ${newStatus}`, {
          autoClose: 3000
        })
        setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, status: newStatus } : row)))
      } catch (error) {
        handleErrorApi({ error })
      }
    }
    setConfirmDialog({ open: false, id: '', newStatus: '' })
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 50,
      valueFormatter: (params) => {
        if (params) {
          return `${params}`
        } else {
          return `${rows.length + 1}`
        }
      }
    },
    { field: 'name', headerName: 'Dịch vụ', width: 350, editable: false },
    {
      field: 'price',
      headerName: 'Giá',
      width: 350,
      editable: false,
      valueGetter: (params: number) => {
        if (params == 0) {
          const price = 0
          return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        }
        return params ? params.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'
      }
    },
    { field: 'quantity', headerName: 'Số lượng', width: 150, editable: false },
    {
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 150,
      editable: false,
      renderCell: (params) => {
        const dateValue = moment(params.value)

        const time = dateValue.format('HH:mm')
        const date = dateValue.format('DD-MM-YY')

        return (
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', height: '100%' }}>
            <Typography variant='body2' color={theme.palette.grey[700]}>
              {time}
            </Typography>
            <Typography variant='body2' color={theme.palette.grey[500]}>
              | {date}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'updatedAt',
      headerName: 'Thời gian cập nhật',
      width: 150,
      editable: false,
      renderCell: (params) => {
        const dateValue = moment(params.value)

        const time = dateValue.format('HH:mm')
        const date = dateValue.format('DD-MM-YY')

        return (
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', height: '100%' }}>
            <Typography variant='body2' color={theme.palette.grey[700]}>
              {time}
            </Typography>
            <Typography variant='body2' color={theme.palette.grey[500]}>
              | {date}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'type',
      headerName: 'Loại dịch vụ',
      width: 150,
      type: 'singleSelect',
      valueOptions: Object.values(AmenityTypeEnum),
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === AmenityTypeEnum.Food ? 'warning' : params.value === 'success' ? 'success' : 'error'}
        />
      ),
      editable: false
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      type: 'singleSelect',
      valueOptions: ['Hoạt động', 'Không hoạt động'],
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'Hoạt động' ? 'success' : 'warning'} />
      ),
      editable: false,
      preProcessEditCellProps: (params) => {
        const { id, props } = params
        editedRowRef.current[id] = { ...editedRowRef.current[id], status: props.value }
        return { ...props }
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
          <AmenityModal row={row} action={ACTION.UPDATE} />,
          <GridActionsCellItem
            icon={row.status === 'Hoạt động' ? <BlockIcon /> : <CheckCircleIcon />}
            label={row.status === 'Hoạt động' ? 'Ban' : 'Unban'}
            onClick={handleToggleStatus(row.id)}
            color={row.status === 'Hoạt động' ? 'error' : 'success'}
          />
        ]
      }
    }
  ]

  const Toolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <AmenityModal action={ACTION.CREATE} />
        <SearchForManage setPaginationModel={setPaginationFilter} />
      </GridToolbarContainer>
    )
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí dịch vụ
        </Typography>
      </Box>
      <Table
        columns={columns}
        rows={rows}
        setRows={setRows}
        loading={isLoading}
        toolbarComponents={Toolbar}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        totalRowCount={totalRowCount}
      />
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: '', newStatus: '' })}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Xác nhận thay đổi trạng thái'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có chắc chắn muốn thay đổi trạng thái của dịch vụ này thành {confirmDialog.newStatus}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: '', newStatus: '' })} color='primary'>
            Hủy
          </Button>
          <Button onClick={handleConfirmToggle} color='primary' autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

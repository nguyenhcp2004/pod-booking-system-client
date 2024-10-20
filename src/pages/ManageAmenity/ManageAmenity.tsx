import { useGetListAmenity } from '~/queries/useAmenity'
import { AmenityType, AmenityTypeEnum } from '~/schemaValidations/amenity.schema'
import { Box, Chip, Typography } from '@mui/material'
import {
  GridActionsCellItem,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridValidRowModel
} from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Table from '~/components/Table/Table'
import AmenityModal from '~/pages/ManageAmenity/AmenityModal'
import { ACTION } from '~/constants/mock'
import BlockIcon from '@mui/icons-material/Block'
import { toast } from 'react-toastify'
import { handleErrorApi } from '~/utils/utils'
import { useDeleteAmenityMutation } from '~/queries/useAmenity' // Import the delete hook

export default function ManageBuilding() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  })
  const { data, isLoading } = useGetListAmenity({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize
  })
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>()
  useEffect(() => {
    if (data) {
      setRows([...data.data.data])
      setTotalRowCount(data.data.totalRecord)
    }
  }, [data])

  const deleteAmenityMutation = useDeleteAmenityMutation()

  const handleDelete = async (amenity: AmenityType) => {
    const { id } = amenity

    if (!id) return

    try {
      const confirmDelete = window.confirm('Bạn có chắc muốn xóa dịch vụ này không?')
      if (!confirmDelete) return

      // Call delete mutation with just the id
      await deleteAmenityMutation.mutateAsync(id)

      toast.success('Xóa dịch vụ thành công!', {
        autoClose: 3000
      })
    } catch (error) {
      handleErrorApi({ error }) // Your custom error handler
      toast.error('Có lỗi xảy ra khi xóa dịch vụ', {
        autoClose: 3000
      })
    }
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
    { field: 'name', headerName: 'Dịch vụ', width: 350, editable: true },
    {
      field: 'price',
      headerName: 'Giá',
      width: 350,
      editable: true
    },
    { field: 'quantity', headerName: 'Số lượng', width: 150, editable: true },
    { field: 'createdAt', headerName: 'Thời gian tạo', width: 150, editable: true },
    { field: 'updatedAt', headerName: 'Thời gian cập nhật', width: 150, editable: true },
    {
      field: 'type',
      headerName: 'Loại dịch vụ',
      width: 150,
      type: 'singleSelect',
      valueOptions: Object.values(AmenityTypeEnum),
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === AmenityTypeEnum.Food
              ? 'warning' // Predefined 'warning' color for Food
              : params.value === 'success'
                ? 'success' // Predefined 'success' color
                : 'error' // Predefined 'error' color for other values
          }
        />
      ),
      editable: true
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
          <GridActionsCellItem icon={<BlockIcon />} onClick={() => handleDelete(row)} label='Delete' />
        ]
      }
    }
  ]

  const Toolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <AmenityModal action={ACTION.CREATE} />
        <GridToolbarQuickFilter />
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
    </Box>
  )
}

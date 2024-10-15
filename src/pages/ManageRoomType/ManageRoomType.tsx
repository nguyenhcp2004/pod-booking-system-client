import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useGetFilterRoomType } from '~/queries/useFilterRoomType'
import RoomTypeModal from './RoomTypeModal'
import { ACTION } from '~/constants/mock'
import Table from '~/components/Table/Table'

export default function RoomType() {
  interface RoomType {
    capacity: number
    id: number
    name: string
    price: number
    quantity: number
    building: {
      address: string
      status: string
      id: number
      description: string
      hotlineNumber: string
      createdAt: string
      updatedAt: string
    }
  }

  const [rows, setRows] = useState<RoomType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { data, isFetching, refetch } = useGetFilterRoomType({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize
  })

  useEffect(() => {
    if (data?.data.data) {
      console.log(data.data.data)
      setRows(data.data.data)
    }
  }, [data])

  const totalRowCount = data?.data.totalRecord || 0

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Tên', width: 150 },
    {
      field: 'price',
      headerName: 'Giá',
      width: 100,
      valueGetter: (params: { row: RoomType }) =>
        params.row?.price ? params.row.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'
    },
    { field: 'quantity', headerName: 'Số lượng', width: 100 },
    { field: 'capacity', headerName: 'Sức chứa', width: 100 },
    {
      field: 'building',
      headerName: 'Tòa nhà',
      width: 150,
      valueGetter: (params: { row: RoomType }) => params.row?.building?.address || 'N/A'
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 100,
      renderCell: (params) => <RoomTypeModal row={params.row} refetch={refetch} action={ACTION.UPDATE} />
    }
  ]

  const Toolbar = () => {
    return (
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
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí phòng
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
    </Box>
  )
}

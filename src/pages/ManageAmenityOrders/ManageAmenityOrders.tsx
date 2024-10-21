import { Box, Typography } from '@mui/material'
import { GridColDef, GridToolbarContainer, GridToolbarQuickFilter, GridValidRowModel } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Table from '~/components/Table/Table'
import { useGetListAmenityOrders } from '~/queries/useOrderDetailAmenity'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import { formatCurrency } from '~/utils/currency'
import AmenityOrderModal from './AddModal'
import { ACTION } from '~/constants/mock'

const ManageAmenityOrders = () => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  })
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>()

  const { data, refetch, isFetching } = useGetListAmenityOrders({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize
  })

  useEffect(() => {
    if (data) {
      setRows([
        ...data.data.data.map((item, index) => ({
          ...item,
          id: index + paginationModel.page * paginationModel.pageSize + 1
        }))
      ])
      setTotalRowCount(data.data.totalRecord)
    }
  }, [data])

  useEffect(() => {
    refetch()
  }, [paginationModel])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 50
    },
    { field: 'orderId', headerName: 'Mã đơn', width: 150 },
    { field: 'room', headerName: 'Phòng', width: 150 },
    { field: 'customer', headerName: 'Khách hàng', width: 200 },
    { field: 'amenity', headerName: 'Tên tiện ích', width: 150, valueGetter: (value: AmenityType) => value?.name },

    { field: 'quantity', headerName: 'Số lượng', width: 150 },
    {
      field: 'price',
      headerName: 'Tổng giá',
      width: 150,
      valueFormatter: (params) => {
        return formatCurrency(params)
      }
    },

    { field: 'createdAt', headerName: 'Thời gian tạo', width: 150 },
    { field: 'updatedAt', headerName: 'Thời gian cập nhật', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ row }) => {
        return [<AmenityOrderModal row={row} refetch={refetch} action={ACTION.UPDATE} />]
      }
    }
  ]

  const Toolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <AmenityOrderModal refetch={refetch} action={ACTION.CREATE} />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    )
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí hóa đơn tiện ích
        </Typography>
      </Box>
      <Table
        columns={columns}
        rows={rows}
        loading={isFetching}
        setRows={setRows}
        toolbarComponents={Toolbar}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        totalRowCount={totalRowCount}
      />
    </Box>
  )
}

export default ManageAmenityOrders

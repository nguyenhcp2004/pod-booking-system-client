import { Box, IconButton, Typography } from '@mui/material'
import { GridColDef, GridToolbarContainer, GridValidRowModel } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Table from '~/components/Table/Table'
import { useGetListAmenityOrders } from '~/queries/useOrderDetailAmenity'
import { formatCurrency } from '~/utils/currency'
import AmenityOrderModal from './CreateAmenityOrderModal'
import { ACTION } from '~/constants/mock'
import moment, { Moment } from 'moment'
import { DatePicker } from '@mui/x-date-pickers'

import { AmenityOrderType, OrderDetailAmenityType } from '~/schemaValidations/amenityOrder.schema'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import EditAmenityOrderModal from './EditAmenityOrderModal'
import { Edit } from '@mui/icons-material'

const ManageAmenityOrders = () => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  })
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [row, setRow] = useState<OrderDetailAmenityType>()
  const [totalRowCount, setTotalRowCount] = useState<number>()
  const [startDate, setStartDate] = useState<Moment | null>(moment())
  const [endDate, setEndDate] = useState<Moment | null>(moment().add(7, 'days'))
  const { data, refetch, isFetching } = useGetListAmenityOrders({
    startDate: startDate?.format('YYYY-MM-DDT00:01') || moment().format('YYYY-MM-DDT00:00'),
    endDate: endDate?.format('YYYY-MM-DDT23:59') || moment().add(7, 'days').format('YYYY-MM-DDT23:59'),
    page: paginationModel.page,
    take: paginationModel.pageSize
  })

  useEffect(() => {
    if (data) {
      setRows([
        ...data.data.data.map((item, index) => ({
          ...item,
          rowId: index + paginationModel.page * paginationModel.pageSize + 1
        }))
      ])
      setTotalRowCount(data.data.totalRecord)
    }
  }, [data])

  useEffect(() => {
    console.log(row)
  }, [row])
  useEffect(() => {
    refetch()
  }, [paginationModel, startDate, endDate])

  const [openModalEdit, setOpenModalEdit] = useState(false)

  const handleClickOpen = ({ row }: { row: OrderDetailAmenityType }) => {
    setRow(row)
    setOpenModalEdit(true)
  }

  const handleClose = () => {
    setOpenModalEdit(false)
  }
  const columns: GridColDef[] = [
    {
      field: 'rowId',
      headerName: 'ID',
      width: 50
    },
    { field: 'orderId', headerName: 'Mã đơn', width: 150 },
    {
      field: 'quantity',
      headerName: 'Số lượng tiện ích',
      width: 150,
      valueGetter: (_, row) => {
        let quantity = 0
        row.orderDetailAmenities.forEach((item: AmenityOrderType) => {
          quantity += item.quantity
        })
        return quantity
      }
    },
    {
      field: 'totalPrice',
      headerName: 'Tổng giá tiện ích',
      width: 150,
      valueGetter: (_, row) => {
        let totalPrice = 0
        row.orderDetailAmenities.forEach((item: AmenityOrderType) => {
          totalPrice += item.price * item.quantity
        })
        return totalPrice
      },
      valueFormatter: (params) => {
        return formatCurrency(params)
      }
    },
    { field: 'roomName', headerName: 'Tên Phòng', width: 150 },
    { field: 'buildingAddress', headerName: 'Chi nhánh' },
    { field: 'customerName', headerName: 'Khách hàng', width: 200 },

    {
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 150,
      valueFormatter: (params) => {
        return params && moment(params).format('DD/MM/YYYY HH:mm')
      }
    },
    {
      field: 'updatedAt',
      headerName: 'Thời gian cập nhật',
      width: 150,
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
          <IconButton onClick={() => handleClickOpen({ row })}>
            <Edit />
          </IconButton>
        ]
      }
    }
  ]
  const FilterToolbar = () => {
    return (
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <DatePicker
          label='Từ ngày'
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
          value={startDate}
          onChange={(date) => setStartDate(date)}
          format={DEFAULT_DATE_FORMAT}
        />
        <DatePicker
          label='Đến ngày'
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
          value={endDate}
          onChange={(date) => setEndDate(date)}
          format={DEFAULT_DATE_FORMAT}
        />
      </Box>
    )
  }
  const Toolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <FilterToolbar />
        <AmenityOrderModal refetch={refetch} />
        {/* <GridToolbarQuickFilter /> */}
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
      {row && <EditAmenityOrderModal row={row} refetch={refetch} open={openModalEdit} handleClose={handleClose} />}
    </Box>
  )
}

export default ManageAmenityOrders

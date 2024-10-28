import { Box, Button, IconButton, Typography } from '@mui/material'
import { GridColDef, GridToolbarContainer, GridValidRowModel } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Table from '~/components/Table/Table'
import {
  useCreateOrderDetailAmenityMutation,
  useCreateOrderDetailAmenityStaff,
  useGetListAmenityOrders
} from '~/queries/useOrderDetailAmenity'
import { formatCurrency } from '~/utils/currency'
import AmenityOrderModal from './CreateAmenityOrderModal'
import moment, { Moment } from 'moment'
import { DatePicker } from '@mui/x-date-pickers'

import { AmenityOrderType, OrderDetailAmenityType } from '~/schemaValidations/amenityOrder.schema'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import EditAmenityOrderModal from './EditAmenityOrderModal'
import { Add, Edit } from '@mui/icons-material'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactionInfo } from '~/apis/paymentApi'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'
import CreateAmenityOrderModal from './CreateAmenityOrderModal'
import { toast } from 'react-toastify'

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
  const { clearAll } = useBookingAmenityContext()
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
    refetch()
  }, [paginationModel, startDate, endDate])

  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [openModalCreate, setOpenModalCreate] = useState(false)

  const handleClickEdit = ({ row }: { row: OrderDetailAmenityType }) => {
    setRow(row)
    setOpenModalEdit(true)
  }
  const handleClickCreate = () => {
    setOpenModalCreate(true)
  }

  const handleClose = () => {
    clearAll()
    setOpenModalEdit(false)
    setOpenModalCreate(false)
  }
  const columns: GridColDef[] = [
    {
      field: 'rowId',
      headerName: 'ID',
      width: 50
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
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 100,
      cellClassName: 'actions',

      getActions: ({ row }) => {
        return [
          <IconButton onClick={() => handleClickEdit({ row })}>
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
        <Button color='primary' startIcon={<Add />} onClick={handleClickCreate}>
          Tạo đơn tiện ích
        </Button>
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
      <CreateAmenityOrderModal refetch={refetch} open={openModalCreate} handleClose={handleClose} />
    </Box>
  )
}

export default ManageAmenityOrders

import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import { GridColDef, GridToolbarContainer, GridValidRowModel } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Table from '~/components/Table/Table'
import { useGetListAmenityOrders, useSearchAmenityInOrderDetailAmenity } from '~/queries/useOrderDetailAmenity'
import moment, { Moment } from 'moment'
import { DatePicker } from '@mui/x-date-pickers'
import { OrderDetailAmenityType } from '~/schemaValidations/amenityOrder.schema'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import EditAmenityOrderModal from './EditAmenityOrderModal'
import { Add, Edit } from '@mui/icons-material'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'
import CreateAmenityOrderModal from './CreateAmenityOrderModal'
import SearchForManage from '~/components/SearchInput/SearchForManage'

const ManageAmenityOrders = () => {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 })
  const [paginationFilter, setPaginationFilter] = useState({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize,
    searchParams: ''
  })

  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [row, setRow] = useState<OrderDetailAmenityType>()
  const [totalRowCount, setTotalRowCount] = useState<number>()
  const [startDate, setStartDate] = useState<Moment | null>(moment())
  const [endDate, setEndDate] = useState<Moment | null>(moment())
  const { clearAll } = useBookingAmenityContext()
  const theme = useTheme()

  const {
    data: listData,
    refetch: refetchList,
    isFetching: isFetchingList
  } = useGetListAmenityOrders({
    startDate: startDate?.format('YYYY-MM-DDT00:01') || moment().format('YYYY-MM-DDT00:00'),
    endDate: endDate?.format('YYYY-MM-DDT23:59') || moment().format('YYYY-MM-DDT23:59'),
    page: paginationModel.page,
    take: paginationModel.pageSize,
    searchParams: ''
  })

  const {
    data: searchData,
    refetch: refetchSearch,
    isFetching: isFetchingSearch
  } = useSearchAmenityInOrderDetailAmenity({
    searchParams: paginationFilter.searchParams,
    startDate: startDate?.format('YYYY-MM-DDT00:01') || moment().format('YYYY-MM-DDT00:00'),
    endDate: endDate?.format('YYYY-MM-DDT23:59') || moment().format('YYYY-MM-DDT23:59'),
    page: paginationFilter.page,
    take: paginationFilter.take
  })

  // Conditionally choose data from the correct hook
  const data = paginationFilter.searchParams ? searchData : listData

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
    if (paginationFilter.searchParams) {
      refetchSearch() // Refetch search query
    } else {
      refetchList() // Refetch list query
    }
  }, [paginationModel, startDate, endDate, paginationFilter.searchParams])

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
    { field: 'rowId', headerName: 'ID', width: 50 },
    { field: 'roomName', headerName: 'Tên Phòng', width: 150 },
    { field: 'buildingAddress', headerName: 'Chi nhánh' },
    { field: 'customerName', headerName: 'Khách hàng', width: 200 },
    {
      field: 'startTime',
      headerName: 'Thời gian bắt đầu',
      width: 150,
      renderCell: (params) => {
        const dateValue = moment(params.value)

        const time = dateValue.format('HH:mm')
        const date = dateValue.format('DD-MM-YYYY')

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
      field: 'endTime',
      headerName: 'Thời gian kết thúc',
      width: 150,
      renderCell: (params) => {
        const dateValue = moment(params.value)

        const time = dateValue.format('HH:mm')
        const date = dateValue.format('DD-MM-YYYY')

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
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 150,
      renderCell: (params) => {
        const dateValue = moment(params.value)

        const time = dateValue.format('HH:mm')
        const date = dateValue.format('DD-MM-YYYY')

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
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ row }) => [
        <IconButton onClick={() => handleClickEdit({ row })}>
          <Edit />
        </IconButton>
      ]
    }
  ]

  const FilterToolbar = () => (
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

  const Toolbar = () => (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
      <Box>
        <FilterToolbar />
      </Box>
      <Box sx={{ display: 'flex', gap: 5 }}>
        <Button color='primary' startIcon={<Add />} onClick={handleClickCreate}>
          Tạo đơn dịch vụ
        </Button>
        <SearchForManage setPaginationModel={setPaginationFilter} />
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí hóa đơn dịch vụ
        </Typography>
      </Box>
      <Table
        columns={columns}
        rows={rows}
        loading={isFetchingList || isFetchingSearch}
        setRows={setRows}
        toolbarComponents={Toolbar}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        totalRowCount={totalRowCount}
      />
      {row && <EditAmenityOrderModal row={row} refetch={refetchList} open={openModalEdit} handleClose={handleClose} />}
      <CreateAmenityOrderModal refetch={refetchList} open={openModalCreate} handleClose={handleClose} />
    </Box>
  )
}

export default ManageAmenityOrders

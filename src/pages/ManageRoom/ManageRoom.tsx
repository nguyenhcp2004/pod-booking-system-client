import { Box, Chip, Link, Typography, useTheme } from '@mui/material'
import { ACTION, ROOM_STATUS } from '~/constants/mock'
import { useGetListRooms } from '~/queries/useRoom'
import Table from '~/components/Table/Table'
import { PaginationSearchQuery, RoomType } from '~/constants/type'
import { useEffect, useState } from 'react'
import RoomModal from './RoomModal'
import { GridColDef, GridRenderCellParams, GridToolbarContainer, GridValidRowModel } from '@mui/x-data-grid'
import SearchForManage from '~/components/SearchInput/SearchForManage'
import { useAppContext } from '~/contexts/AppProvider'
import moment from 'moment'

export default function ManageRoom() {
  const { account } = useAppContext()
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  })
  const [paginationFilter, setPaginationFilter] = useState({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize,
    searchParams: ''
  })
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>()

  const { data, refetch, isFetching } = useGetListRooms({
    ...paginationFilter,
    buildingId: account?.buildingNumber
  } as PaginationSearchQuery)
  const theme = useTheme()

  useEffect(() => {
    if (data) {
      setRows(
        data.data.data.map((room, index) => ({
          ...room,
          building: room.roomType.building.address,
          index: index + (paginationFilter.page - 1) * paginationFilter.take + 1
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

  const ExpandableCell = ({ value }: GridRenderCellParams) => {
    const [expanded, setExpanded] = useState(false)

    return (
      <div>
        {expanded ? value : value.slice(0, 200)}&nbsp;
        {value.length > 200 && (
          <Link
            type='button'
            component='button'
            sx={{ fontSize: 'inherit', letterSpacing: 'inherit' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'thu gọn' : 'xem thêm'}
          </Link>
        )}
      </div>
    )
  }
  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      width: 50
    },
    {
      field: 'id',
      headerName: 'ID phòng',
      width: 50
    },
    { field: 'name', headerName: 'Tên' },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 250,
      renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />
    },
    {
      field: 'roomType',
      headerName: 'Loại phòng',
      valueGetter: (value: RoomType) => value?.name
    },
    {
      field: 'building',
      headerName: 'Chi nhánh'
    },
    {
      field: 'status',
      headerName: 'Trạng thái',

      type: 'singleSelect',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      valueOptions: Object.entries(ROOM_STATUS).map(([_, value]) => value),
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === ROOM_STATUS.AVAILABLE ? 'success' : 'warning'} />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 150,
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
      getActions: ({ row }) => {
        return [<RoomModal row={row} refetch={refetch} action={ACTION.UPDATE} />]
      }
    }
  ]

  const Toolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <RoomModal
          row={{
            id: 1,
            name: '',
            description: '',
            image: '',
            roomType: {
              name: '',
              id: 0,
              quantity: 0,
              capacity: 0,
              price: 0,
              building: {
                status: '',
                createdAt: '',
                updatedAt: '',
                address: '',
                id: 0,
                description: '',
                hotlineNumber: ''
              }
            },
            status: 'Available',
            createdAt: '2021-09-01',
            updatedAt: '2021-09-01'
          }}
          refetch={refetch}
          action={ACTION.CREATE}
        />
        <SearchForManage setPaginationModel={setPaginationFilter} />
        {/* <GridToolbarQuickFilter /> */}
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

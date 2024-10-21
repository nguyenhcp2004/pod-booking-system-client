import { Box, Chip, Link, Typography } from '@mui/material'
import { ACTION, ROOM_STATUS } from '~/constants/mock'
import { useGetListRooms } from '~/queries/useRoom'
import Table from '~/components/Table/Table'
import { RoomType } from '~/constants/type'
import { useEffect, useState } from 'react'
import RoomModal from './RoomModal'
import {
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridValidRowModel
} from '@mui/x-data-grid'

export default function ManageRoom() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  })
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>()

  const { data, refetch, isFetching } = useGetListRooms({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize
  })

  useEffect(() => {
    if (data) {
      setRows([...data.data.data])
      setTotalRowCount(data.data.totalRecord)
    }
  }, [data])

  useEffect(() => {
    refetch()
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
      field: 'id',
      headerName: 'ID',
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
      field: 'image',
      headerName: 'Ảnh',

      renderCell: (params: GridRenderCellParams) => (
        <img
          src={params.value as string}
          alt='room-img'
          style={{ width: '100%', height: '100%', borderRadius: '4px' }}
        />
      )
    },
    {
      field: 'roomType',
      headerName: 'Loại phòng',

      valueGetter: (value: RoomType) => value?.name
    },
    {
      field: 'status',
      headerName: 'Trạng thái',

      type: 'singleSelect',
      valueOptions: Object.entries(ROOM_STATUS).map(([_, value]) => value),
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === ROOM_STATUS.AVAILABLE ? 'success' : 'warning'} />
      )
    },
    { field: 'createdAt', headerName: 'Thời gian tạo' },
    { field: 'updatedAt', headerName: 'Thời gian cập nhật' },
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

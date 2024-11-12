import { useGetFilterBuilding } from '~/queries/useBuilding'
import { BuildingStatus, GetFilteredBuildingQueryType } from '~/schemaValidations/building.schema'
import { Box, Chip, Typography, useTheme } from '@mui/material'
import { GridColDef, GridToolbarContainer, GridValidRowModel } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Table from '~/components/Table/Table'
import BuildingModal from '~/pages/ManageBuilding/BuildingModal'
import { ACTION } from '~/constants/mock'
import SearchInput from '~/components/SearchInput/SearchInput'
import moment from 'moment'

export default function ManageBuilding() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0
  })
  const [paginationFilter, setPaginationFilter] = useState({
    page: paginationModel.page + 1,
    take: paginationModel.pageSize,
    address: ''
  })
  const theme = useTheme()
  const { data, isLoading } = useGetFilterBuilding(paginationFilter as GetFilteredBuildingQueryType)
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>()
  useEffect(() => {
    if (data) {
      setRows(
        data.data.data.map((building, index) => ({
          ...building,
          sequentialIndex: index + 1
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

  const columns: GridColDef[] = [
    {
      field: 'sequentialIndex',
      headerName: 'STT',
      width: 50
    },
    { field: 'address', headerName: 'Chi nhánh', width: 350, editable: false },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 350,
      editable: false
    },
    { field: 'hotlineNumber', headerName: 'Hotline', width: 150, editable: false },
    {
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 150,
      editable: false,
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
      field: 'updatedAt',
      headerName: 'Thời gian cập nhật',
      width: 150,
      editable: false,
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
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      type: 'singleSelect',
      valueOptions: Object.values(BuildingStatus),
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === BuildingStatus.Active
              ? 'success'
              : params.value === BuildingStatus.UnderMaintenance
                ? 'warning'
                : 'error'
          }
        />
      ),
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ row }) => {
        return [<BuildingModal row={row} action={ACTION.UPDATE} />]
      }
    }
  ]

  const Toolbar = () => {
    return (
      <GridToolbarContainer
        sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}
      >
        <BuildingModal action={ACTION.CREATE} />
        <SearchInput setPaginationModel={setPaginationFilter} />
        {/* <GridToolbarQuickFilter sx={{ maxWidth: '320px', height: '56px', justifyContent: 'center' }} /> */}
      </GridToolbarContainer>
    )
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí chi nhánh
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

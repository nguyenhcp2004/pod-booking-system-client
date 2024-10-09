import { useGetListBuilding } from '~/queries/useBuilding'
import { BuildingStatus } from '~/schemaValidations/building.schema'
import { Box, Button, Chip, Link, Typography } from '@mui/material'
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridValidRowModel
} from '@mui/x-data-grid'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useEffect, useState } from 'react'
import Table from '~/components/Table/Table'

export default function ManageBuilding() {
  const { data } = useGetListBuilding()
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  useEffect(() => {
    if (data) {
      setRows([...data.data.data].reverse())
    }
  }, [data])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

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
            {expanded ? 'view less' : 'view more'}
          </Link>
        )}
      </div>
    )
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
    { field: 'address', headerName: 'Chi nhánh', width: 150, editable: true },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 250,
      editable: true,
      renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />
    },
    { field: 'hotlineNumber', headerName: 'Hotline', width: 150, editable: true },
    { field: 'createdAt', headerName: 'Thời gian tạo', width: 150, editable: true },
    { field: 'updatedAt', headerName: 'Thời gian cập nhật', width: 150, editable: true },
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
      editable: true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(id)} color='inherit' />
        ]
      }
    }
  ]

  const Toolbar = () => {
    const handleClick = () => {
      const id = ''
      setRows((oldRows) => [
        ...oldRows,
        { id, name: '', description: '', image: '', status: '', type: '', price: 0, isNew: true }
      ])
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
      }))
    }

    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
          Thêm phòng
        </Button>
        <GridToolbarQuickFilter />
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
        rowModesModel={rowModesModel}
        setRowModesModel={setRowModesModel}
        toolbarComponents={Toolbar}
      />
    </Box>
  )
}

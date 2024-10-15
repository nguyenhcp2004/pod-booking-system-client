import { Box, Button, MenuItem, Select, Typography } from '@mui/material'
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer,
  GridValidRowModel
} from '@mui/x-data-grid'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import Table from '~/components/Table/Table'

const buildings = ['Tòa nhà A', 'Tòa nhà B', 'Tòa nhà C']

const initialRows: GridValidRowModel[] = [
  {
    id: 1,
    name: 'Phòng 2 người',
    price: 500000,
    quantity: 10,
    capacity: 2,
    rooms: ['101', '102', '103', '104', '105'],
    building: 'Tòa nhà A'
  },
  {
    id: 2,
    name: 'Phòng 3 người',
    price: 750000,
    quantity: 5,
    capacity: 3,
    rooms: ['201', '202', '203'],
    building: 'Tòa nhà B'
  },
  {
    id: 3,
    name: 'Phòng VIP',
    price: 1000000,
    quantity: 2,
    capacity: 4,
    rooms: ['301'],
    building: 'Tòa nhà C'
  },
  {
    id: 4,
    name: 'Phòng 1 người',
    price: 300000,
    quantity: 15,
    capacity: 1,
    rooms: ['401', '402', '403', '404', '405', '406', '407', '408'],
    building: 'Tòa nhà A'
  },
  {
    id: 5,
    name: 'Phòng đôi',
    price: 550000,
    quantity: 8,
    capacity: 2,
    rooms: ['501', '502', '503', '504'],
    building: 'Tòa nhà B'
  }
]

export default function ManageRoomType() {
  const [rows, setRows] = useState<GridValidRowModel[]>(initialRows)
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
    {
      field: 'name',
      headerName: 'Tên loại phòng',
      width: 150,
      editable: true,
      renderCell: (params: GridRenderCellParams) => <div onClick={handleEditClick(params.id)}>{params.value}</div>
    },
    {
      field: 'price',
      headerName: 'Giá',
      width: 150,
      valueFormatter: (params: { value: number }) => {
        return `${params.value} đ`
      },
      type: 'number',
      editable: true
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 150,
      type: 'number',
      editable: true
    },
    {
      field: 'capacity',
      headerName: 'Sức chứa',
      width: 150,
      type: 'number',
      editable: true
    },
    {
      field: 'rooms',
      headerName: 'Tên phòng',
      width: 150,
      renderCell: (params: GridRenderCellParams) => <div>{params.value.join(', ')}</div>
    },
    {
      field: 'building',
      headerName: 'Tòa nhà',
      width: 150,
      editable: true,
      renderCell: (params: GridRenderCellParams) => <div>{params.value}</div>,
      renderEditCell: (params: GridRenderCellParams) => (
        <Select
          value={params.value}
          onChange={(event) => {
            const newValue = event.target.value
            console.log(newValue)
            setRows((oldRows) => oldRows.map((row) => (row.id === params.id ? { ...row, building: newValue } : row)))
            console.log(rows.filter((row) => row.id === params.id)[0].building)
          }}
          fullWidth
        >
          {buildings.map((building) => (
            <MenuItem key={building} value={building}>
              {building}
            </MenuItem>
          ))}
        </Select>
      )
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
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem icon={<CancelIcon />} label='Cancel' onClick={handleCancelClick(id)} color='inherit' />
          ]
        }

        return [
          <GridActionsCellItem icon={<EditIcon />} label='Edit' onClick={handleEditClick(id)} color='inherit' />,
          <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(id)} color='inherit' />
        ]
      }
    }
  ]

  const Toolbar = () => {
    const handleClick = () => {
      const id = rows.length + 1
      const newRows = { id, name: '', price: 0, quantity: 0, capacity: 0, rooms: [], building: '', isNew: true }
      setRows((oldRows) => [newRows, ...oldRows])
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
      }))
    }

    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
          Thêm loại phòng
        </Button>
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí loại phòng
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

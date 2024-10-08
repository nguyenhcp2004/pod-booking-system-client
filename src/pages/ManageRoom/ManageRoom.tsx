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
import { useState } from 'react'
import { formatCurrency } from '~/utils/currency'
import Table from '~/components/Table/Table'

const initialRows: GridValidRowModel[] = [
  {
    id: 1,
    name: 'Phòng A1',
    description:
      'Phasellus et ultrices dui. Phasellus et ultrices dui. Vestibulum in massa nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce facilisis egestas massa, et eleifend magna imperdiet et. Sed feugiat venenatis nulla, sit amet dictum nulla convallis sit amet. Nullam cursus tincidunt auctor.',
    image: 'imageA1.jpg',
    type: 'Phòng 2 người',
    price: 500000,
    status: 'Đang hoạt động',
    createdAt: '2024-09-01 08:30',
    updatedAt: '2024-09-10 15:45'
  },
  {
    id: 2,
    name: 'Phòng B2',
    description: 'Phòng 3 người tiện nghi với view đẹp',
    image: 'imageB2.jpg',
    type: 'Phòng 3 người',
    price: 750000,
    status: 'Bảo trì',
    createdAt: '2024-08-25 09:00',
    updatedAt: '2024-09-12 11:20'
  },
  {
    id: 3,
    name: 'Phòng C3',
    description: 'Phòng VIP cho nhóm 4 người',
    image: 'imageC3.jpg',
    type: 'Phòng VIP',
    price: 1000000,
    status: 'Đang hoạt động',
    createdAt: '2024-09-05 10:15',
    updatedAt: '2024-09-20 14:30'
  },
  {
    id: 4,
    name: 'Phòng D4',
    description: 'Phòng nhỏ cho 1 người làm việc',
    image: 'imageD4.jpg',
    type: 'Phòng 1 người',
    price: 300000,
    status: 'Đang hoạt động',
    createdAt: '2024-09-10 07:45',
    updatedAt: '2024-09-18 09:50'
  },
  {
    id: 5,
    name: 'Phòng E5',
    description: 'Phòng đôi với tiện nghi cao cấp',
    image: 'imageE5.jpg',
    type: 'Phòng 2 người',
    price: 550000,
    status: 'Đã đặt trước',
    createdAt: '2024-09-15 13:00',
    updatedAt: '2024-09-21 16:00'
  }
]

export default function ManageRoom() {
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
    { field: 'name', headerName: 'Tên', width: 150, editable: true },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 250,
      editable: true,
      renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />
    },
    { field: 'image', headerName: 'Ảnh', width: 150, editable: true },
    { field: 'type', headerName: 'Loại phòng', width: 150, editable: true },
    {
      field: 'price',
      headerName: 'Giá',
      width: 150,
      valueFormatter: (params) => {
        return formatCurrency(params as number)
      },
      type: 'number',
      editable: true
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      type: 'singleSelect',
      valueOptions: ['Đang hoạt động', 'Bảo trì', 'VCL'],
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Đang hoạt động' ? 'success' : params.value === 'Bảo trì' ? 'warning' : 'error'}
        />
      ),
      editable: true
    },
    { field: 'createdAt', headerName: 'Thời gian tạo', width: 150, editable: true },
    { field: 'updatedAt', headerName: 'Thời gian cập nhật', width: 150, editable: true },
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
          Quản lí phòng
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

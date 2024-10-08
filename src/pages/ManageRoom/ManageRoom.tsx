import { Box, Button, Link, Typography } from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter
} from '@mui/x-data-grid'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { viVN } from '@mui/x-data-grid/locales'
import { randomUUID } from 'crypto'
import { useState } from 'react'
import { formatCurrency } from '~/utils/currency'

const initialRows: GridRowsProp = [
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

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = 1000 + Math.floor(Math.random() * 1000)
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

export default function ManageRoom() {
  const [rows, setRows] = useState(initialRows)
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

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

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
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
    { field: 'id', headerName: 'ID', width: 50 },
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
        <Box
          component='span'
          sx={{
            color:
              params.value === 'Đang hoạt động'
                ? 'success.main'
                : params.value === 'Bảo trì'
                  ? 'warning.main'
                  : 'error.main',
            bgcolor:
              params.value === 'Đang hoạt động'
                ? 'success.light'
                : params.value === 'Bảo trì'
                  ? 'warning.light'
                  : 'error.light',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}
        >
          {params.value}
        </Box>
      ),
      editable: true
    },
    { field: 'createdAt', headerName: 'Thời gian tạo', width: 150, editable: true },
    { field: 'updatedAt', headerName: 'Thời gian cập nhật', width: 150, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lí phòng
        </Typography>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
        autoHeight
        getRowHeight={() => 'auto'}
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton'
          },
          toolbar: {
            showQuickFilter: true,
            setRows,
            setRowModesModel
          }
        }}
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: 1
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px'
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px'
          },
          padding: '16px 0'
        }}
        loading={false}
        // slots={{ toolbar: GridToolbar

        //  }}
        disableColumnSelector
        disableColumnFilter
        disableDensitySelector
        density='comfortable'
        editMode='row'
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots['toolbar']
        }}
      />
    </Box>
  )
}

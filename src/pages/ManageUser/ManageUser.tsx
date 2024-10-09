import { Box, Button, Chip, Typography, Avatar } from '@mui/material'
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
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://png.pngtree.com/png-clipart/20230917/original/pngtree-user-icon-vector-png-image_12276906.png',
    point: 100,
    role: 'Staff',
    balance: 1000000,
    buildingNumber: 1,
    createdAt: '2024-09-01 08:30',
    rankingName: 'Silver'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://png.pngtree.com/png-clipart/20230917/original/pngtree-user-icon-vector-png-image_12276906.png',
    point: 200,
    role: 'Manager',
    balance: 2000000,
    buildingNumber: 2,
    createdAt: '2024-08-25 09:00',
    rankingName: 'Gold'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://png.pngtree.com/png-clipart/20230917/original/pngtree-user-icon-vector-png-image_12276906.png',
    point: 500,
    role: 'Admin',
    balance: 5000000,
    buildingNumber: 3,
    createdAt: '2024-09-05 10:15',
    rankingName: 'Platinum'
  },
  {
    id: 4,
    name: 'Customer One',
    email: 'customer1@example.com',
    avatar: 'https://png.pngtree.com/png-clipart/20230917/original/pngtree-user-icon-vector-png-image_12276906.png',
    point: 50,
    role: 'Customer',
    balance: 500000,
    buildingNumber: 4,
    createdAt: '2024-09-10 07:45',
    rankingName: 'Bronze'
  },
  {
    id: 5,
    name: 'Staff Member',
    email: 'staff@example.com',
    avatar: 'https://png.pngtree.com/png-clipart/20230917/original/pngtree-user-icon-vector-png-image_12276906.png',
    point: 150,
    role: 'Staff',
    balance: 1500000,
    buildingNumber: 5,
    createdAt: '2024-09-15 13:00',
    rankingName: 'Silver'
  }
]

export default function ManageUser() {
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

  // const ExpandableCell = ({ value }: GridRenderCellParams) => {
  //   const [expanded, setExpanded] = useState(false)

  //   return (
  //     <div>
  //       {expanded ? value : value.slice(0, 20)}&nbsp;
  //       {value.length > 20 && (
  //         <Link
  //           type='button'
  //           component='button'
  //           sx={{ fontSize: 'inherit', letterSpacing: 'inherit' }}
  //           onClick={() => setExpanded(!expanded)}
  //         >
  //           {expanded ? 'view less' : 'view more'}
  //         </Link>
  //       )}
  //     </div>
  //   )
  // }

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
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: true
      // renderCell: (params: GridRenderCellParams) => <ExpandableCell {...params} />
    },
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 100,
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar src={params.value} alt={`Avatar of ${params.row.name}`} sx={{ width: 40, height: 40 }} />
      )
    },
    { field: 'point', headerName: 'Điểm', width: 100, type: 'number', editable: true },
    {
      field: 'role',
      headerName: 'Vai trò',
      width: 120,
      type: 'singleSelect',
      valueOptions: ['Staff', 'Manager', 'Admin', 'Customer'],
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Admin'
              ? 'error'
              : params.value === 'Manager'
                ? 'warning'
                : params.value === 'Staff'
                  ? 'info'
                  : 'default'
          }
        />
      ),
      editable: true
    },
    {
      field: 'balance',
      headerName: 'Số dư',
      width: 150,
      valueFormatter: (params) => {
        return formatCurrency(params as number)
      },
      type: 'number',
      editable: true
    },
    { field: 'buildingNumber', headerName: 'Số tòa nhà', width: 120, type: 'number', editable: true },
    { field: 'createdAt', headerName: 'Thời gian tạo', width: 180, editable: false },
    { field: 'rankingName', headerName: 'Xếp hạng', width: 120, editable: true },
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
      const id = Math.max(...rows.map((row) => Number(row.id))) + 1
      setRows((oldRows) => [
        ...oldRows,
        {
          id,
          name: '',
          email: '',
          avatar: '',
          point: 0,
          role: 'Staff',
          balance: 0,
          buildingNumber: 0,
          createdAt: new Date().toISOString(),
          rankingName: '',
          isNew: true
        }
      ])
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
      }))
    }

    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
          Thêm tài khoản
        </Button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Quản lý tài khoản
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

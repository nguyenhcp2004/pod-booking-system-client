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
import { useEffect, useState } from 'react'
import { formatCurrency } from '~/utils/currency'
import Table from '~/components/Table/Table'
import { useGetManageAccount } from '~/queries/useAccount'

export default function ManageUser() {
  const { data, isLoading } = useGetManageAccount({ page: 1, take: 10 })
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  useEffect(() => {
    if (data?.data.data) {
      setRows(
        data.data.data.map((user) => ({
          ...user,
          status: user.status === 1 ? 'Hoạt động' : 'Không hoạt động'
        }))
      )
    }
  }, [data])

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows?.filter((row) => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })

    const editedRow = rows?.find((row) => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows?.filter((row) => row.id !== id))
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 50,
      editable: false
    },
    { field: 'name', headerName: 'Tên', width: 150, editable: true },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: true
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
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      type: 'singleSelect',
      valueOptions: ['Hoạt động', 'Không hoạt động'],
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'Hoạt động' ? 'success' : 'warning'} />
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
          status: 'Hoạt động',
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
        loading={isLoading}
        toolbarComponents={Toolbar}
      />
    </Box>
  )
}

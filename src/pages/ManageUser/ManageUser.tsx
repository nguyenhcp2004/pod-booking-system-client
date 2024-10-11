import { Box, Chip, Typography, Avatar } from '@mui/material'
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
import BlockIcon from '@mui/icons-material/Block'
import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '~/utils/currency'
import Table from '~/components/Table/Table'
import { useGetManageAccount, useUpdateAccountByAdmin } from '~/queries/useAccount'
import { UpdateAccountByAdminBodyType } from '~/schemaValidations/account.schema'
import { toast } from 'react-toastify'
import { handleErrorApi } from '~/utils/utils'
import AddUser from './AddUser'

export default function ManageUser() {
  const { data, isLoading } = useGetManageAccount()
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const updateAccountByAdminMutation = useUpdateAccountByAdmin()
  const editedRowRef = useRef<{ [id: GridRowId]: GridValidRowModel }>({})

  useEffect(() => {
    if (data?.data.data) {
      setRows(
        data.data.data.map((user, index) => ({
          ...user,
          sequentialIndex: index + 1,
          status: user.status === 1 ? 'Hoạt động' : 'Không hoạt động'
        }))
      )
    }
  }, [data])

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
    // Store the current row data in editedRowRef when entering edit mode
    const currentRow = rows.find((row) => row.id === id)
    if (currentRow) {
      editedRowRef.current[id] = { ...currentRow }
    }
  }

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    const editedRow = editedRowRef.current[id]
    if (editedRow) {
      try {
        const body: UpdateAccountByAdminBodyType = {
          id: editedRow.id,
          name: editedRow.name,
          buildingNumber: editedRow.buildingNumber,
          status: editedRow.status === 'Hoạt động' ? 1 : 0,
          role: editedRow.role
        }
        const result = await updateAccountByAdminMutation.mutateAsync(body)
        toast.success(result.data.message)
        setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, ...editedRow } : row)))
        delete editedRowRef.current[id]
      } catch (error) {
        handleErrorApi({ error })
      }
    }
  }

  const handleBanClick = (id: GridRowId) => async () => {
    const rowToBan = rows.find((row) => row.id === id)
    if (rowToBan) {
      try {
        const body: UpdateAccountByAdminBodyType = {
          id: rowToBan.id,
          name: rowToBan.name,
          buildingNumber: rowToBan.buildingNumber,
          status: 0,
          role: rowToBan.role
        }
        await updateAccountByAdminMutation.mutateAsync(body)
        toast.success(`Người dùng: ${rowToBan.name} bị cấm hoạt động thành công`)
        setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, status: 'Không hoạt động' } : row)))
      } catch (error) {
        handleErrorApi({ error })
      }
    }
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
    delete editedRowRef.current[id]
  }

  const columns: GridColDef[] = [
    {
      field: 'sequentialIndex',
      headerName: 'STT',
      width: 70,
      editable: false
    },
    {
      field: 'name',
      headerName: 'Tên',
      width: 150,
      editable: true,
      preProcessEditCellProps: (params) => {
        const { id, props } = params
        editedRowRef.current[id] = { ...editedRowRef.current[id], name: props.value }
        return { ...props }
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: false
    },
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 100,
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar src={params.value} alt={`Avatar of ${params.row.name}`} sx={{ width: 40, height: 40 }} />
      )
    },
    {
      field: 'point',
      headerName: 'Điểm',
      width: 100,
      type: 'number',
      editable: false
    },
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
      editable: true,
      preProcessEditCellProps: (params) => {
        const { id, props } = params
        editedRowRef.current[id] = { ...editedRowRef.current[id], role: props.value }
        return { ...props }
      }
    },
    {
      field: 'balance',
      headerName: 'Số dư',
      width: 150,
      valueFormatter: (params) => {
        return formatCurrency(params as number)
      },
      type: 'number',
      editable: false
    },
    {
      field: 'buildingNumber',
      headerName: 'Số tòa nhà',
      width: 120,
      type: 'number',
      editable: true,
      preProcessEditCellProps: (params) => {
        const { id, props } = params
        editedRowRef.current[id] = { ...editedRowRef.current[id], buildingNumber: props.value }
        return { ...props }
      }
    },
    { field: 'createdAt', headerName: 'Thời gian tạo', width: 180, editable: false },
    {
      field: 'rankingName',
      headerName: 'Xếp hạng',
      width: 120,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      type: 'singleSelect',
      valueOptions: ['Hoạt động', 'Không hoạt động'],
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'Hoạt động' ? 'success' : 'warning'} />
      ),
      editable: true,
      preProcessEditCellProps: (params) => {
        const { id, props } = params
        editedRowRef.current[id] = { ...editedRowRef.current[id], status: props.value }
        return { ...props }
      }
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
          <GridActionsCellItem icon={<BlockIcon />} label='Ban' onClick={handleBanClick(id)} color='inherit' />
        ]
      }
    }
  ]

  const Toolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <AddUser />
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

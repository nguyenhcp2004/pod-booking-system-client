import {
  Box,
  Chip,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme
} from '@mui/material'
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowParams,
  GridToolbarContainer,
  GridValidRowModel
} from '@mui/x-data-grid'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { formatCurrency } from '~/utils/currency'
import Table from '~/components/Table/Table'
import { useGetManageAccount, useUpdateAccountByAdmin } from '~/queries/useAccount'
import { UpdateAccountByAdminBodyType } from '~/schemaValidations/account.schema'
import { toast } from 'react-toastify'
import { handleErrorApi } from '~/utils/utils'
import UserModal from './UserModal'
import { ACTION } from '~/constants/mock'
import SearchForManage from '~/components/SearchInput/SearchForManage'
import { PaginationSearchQuery } from '~/constants/type'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { useAppContext } from '~/contexts/AppProvider'
import envConfig from '~/constants/config'
import moment from 'moment'
export default function ManageUser() {
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
  const theme = useTheme()
  const { data, refetch, isLoading } = useGetManageAccount(paginationFilter as PaginationSearchQuery)
  const [rows, setRows] = useState<GridValidRowModel[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>()
  const updateAccountByAdminMutation = useUpdateAccountByAdmin()
  const editedRowRef = useRef<{ [id: GridRowId]: GridValidRowModel }>({})
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: '', newStatus: '' })
  const socketCL = new SockJS(envConfig.VITE_SOCKET_URL)
  const client = Stomp.over(socketCL)

  useEffect(() => {
    client.connect({}, () => {
      console.log('Connected to socket')
    })

    return () => {
      if (client.connected) {
        client.disconnect(() => {})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (data?.data.data) {
      setRows(
        data.data.data.map((user, index) => ({
          ...user,
          sequentialIndex: index + 1,
          status: user.status === 1 ? 'Hoạt động' : 'Không hoạt động'
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

  const sendSocketLogoutMessage = () => {
    const payload = {
      accountId: confirmDialog.id
    }
    if (confirmDialog.newStatus === 'Không hoạt động') {
      client.send('/app/logout-user', {}, JSON.stringify(payload))
    }
  }

  const handleToggleStatus = (id: GridRowId) => () => {
    const rowToToggle = rows.find((row) => row.id === id)
    if (rowToToggle) {
      const newStatus = rowToToggle.status === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động'
      setConfirmDialog({ open: true, id: id as string, newStatus })
    }
  }

  const handleConfirmToggle = async () => {
    const { id, newStatus } = confirmDialog
    const rowToToggle = rows.find((row) => row.id === id)
    if (rowToToggle) {
      try {
        const body: UpdateAccountByAdminBodyType = {
          id: rowToToggle.id,
          name: rowToToggle.name,
          buildingNumber: rowToToggle.buildingNumber,
          status: newStatus === 'Hoạt động' ? 1 : 0,
          role: rowToToggle.role
        }
        await updateAccountByAdminMutation.mutateAsync(body)
        toast.success(`Trạng thái của người dùng ${rowToToggle.name} đã được cập nhật thành ${newStatus}`)
        setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, status: newStatus } : row)))
        if (newStatus === 'Không hoạt động') {
          sendSocketLogoutMessage()
        }
      } catch (error) {
        handleErrorApi({ error })
      }
    }
    setConfirmDialog({ open: false, id: '', newStatus: '' })
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
      editable: false,
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
      editable: false,
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
      editable: false
    },
    {
      field: 'building',
      headerName: 'Địa chỉ tòa nhà',
      width: 120,
      editable: false,
      renderCell: (params) => <>{params.value?.address || '--'}</>,
      preProcessEditCellProps: (params) => {
        const { id, props } = params
        editedRowRef.current[id] = { ...editedRowRef.current[id], buildingNumber: props.value }
        return { ...props }
      }
    },
    {
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 180,
      editable: false,
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
      editable: false,
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
      getActions: ({ row }: GridRowParams): ReactElement[] => {
        const propRow = {
          ...row,
          buildingNumber: row?.building?.id || 0,
          status: row.status === 'Hoạt động' ? 1 : 0
        }
        const actions: ReactElement[] = []

        if (account?.role === 'Admin') {
          actions.push(<UserModal key='edit' row={propRow} refetch={refetch} action={ACTION.UPDATE} />)
        }

        actions.push(
          <GridActionsCellItem
            key='toggle'
            icon={row.status === 'Hoạt động' ? <BlockIcon /> : <CheckCircleIcon />}
            label={row.status === 'Hoạt động' ? 'Ban' : 'Unban'}
            onClick={handleToggleStatus(row.id)}
            color={row.status === 'Hoạt động' ? 'error' : 'success'}
            disabled={account?.role !== 'Admin'}
          />
        )

        return actions
      }
    }
  ]

  const Toolbar = () => {
    return (
      <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <UserModal
          row={{
            id: '',
            name: '',
            email: '',
            avatar: '',
            point: 0,
            role: '',
            balance: 0,
            buildingNumber: 0,
            rankingName: '',
            createdAt: '2021-09-01',
            status: 1
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
          Quản lý tài khoản
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

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: '', newStatus: '' })}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Xác nhận thay đổi trạng thái'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có chắc chắn muốn thay đổi trạng thái của người dùng này thành {confirmDialog.newStatus}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: '', newStatus: '' })} color='primary'>
            Hủy
          </Button>
          <Button onClick={handleConfirmToggle} color='primary' autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

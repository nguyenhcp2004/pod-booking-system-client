import Edit from '@mui/icons-material/Edit'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import { useCreateAccountMutation, useUpdateAccountByAdmin } from '~/queries/useAccount'
import AddIcon from '@mui/icons-material/Add'
import {
  AccountSchemaType,
  CreateAccountBody,
  CreateAccountBodyType,
  UpdateAccountByAdminBody
} from '~/schemaValidations/account.schema'
import { toast } from 'react-toastify'
import { handleErrorApi } from '~/utils/utils'
import { ACOUNT_ROLE, ACTION } from '~/constants/mock'
import BackdropCustom from '~/components/Progress/Backdrop'
import { z } from 'zod'
import { useGetAllBuilding } from '~/queries/useBuilding'
import { useAppContext } from '~/contexts/AppProvider'

export const AccountRole = {
  Customer: 'Customer',
  Manager: 'Manager',
  Staff: 'Staff'
} as const

const UserModal = ({ row, refetch, action }: { row: AccountSchemaType; refetch: () => void; action: string }) => {
  const { account } = useAppContext()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(ACTION.CREATE === action ? '' : row.name)
  const [role, setRole] = useState(
    ACTION.CREATE === action && row.role !== ACOUNT_ROLE.ADMIN
      ? AccountRole.Customer.toString()
      : row.role !== ACOUNT_ROLE.ADMIN
        ? row.role
        : AccountRole.Customer.toString()
  )
  const [buildingNumber, setBuildingNumber] = useState(ACTION.CREATE === action ? 0 : row.buildingNumber)
  const [status, setStatus] = useState<number>(ACTION.CREATE === action ? 1 : row.status)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const createAccount = useCreateAccountMutation()
  const updateAccount = useUpdateAccountByAdmin()

  const [availableRoles, setAvailableRoles] = useState<string[]>([])

  useEffect(() => {
    if (action === ACTION.UPDATE) {
      switch (row.role) {
        case AccountRole.Staff:
          setAvailableRoles([AccountRole.Manager, AccountRole.Staff])
          break
        case AccountRole.Manager:
          setAvailableRoles([AccountRole.Manager, AccountRole.Staff])
          break
        case AccountRole.Customer:
          setAvailableRoles([AccountRole.Customer]) // Customer can't be updated
          break
        default:
          setAvailableRoles([])
      }
    } else if (action === ACTION.CREATE) {
      if (account) {
        switch (account.role) {
          case AccountRole.Staff:
            setAvailableRoles([AccountRole.Customer])
            break
          case AccountRole.Manager:
            setAvailableRoles([AccountRole.Customer, AccountRole.Staff])
            break
          case 'Admin':
            setAvailableRoles([AccountRole.Customer, AccountRole.Staff, AccountRole.Manager])
            break
          default:
            setAvailableRoles([])
        }
      }
    }
  }, [action, row.role, account])

  const { data: allBuildingRes } = useGetAllBuilding()
  const allBuilding = allBuildingRes?.data.data

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string)
  }

  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setStatus(event.target.value as number)
  }

  const handleBuildingNumberChange = (event: SelectChangeEvent<number>) => {
    setBuildingNumber(event.target.value as number)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const validateForm = (data: unknown): boolean => {
    let validationSchema
    if (action === ACTION.CREATE) {
      validationSchema = CreateAccountBody
    } else {
      validationSchema = UpdateAccountByAdminBody
    }

    try {
      validationSchema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (createAccount.isPending) return

    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries(formData.entries()) as unknown as CreateAccountBodyType
    const payLoadCreate = {
      ...formJson,
      name: name,
      role: role,
      status: status,
      buildingNumber: buildingNumber
    }
    const payLoadUpdate = {
      ...row,
      name: name,
      role: role,
      status: status,
      buildingNumber: role === AccountRole.Manager || role === AccountRole.Staff ? buildingNumber : 0
    }

    try {
      let result
      if (action === ACTION.UPDATE) {
        if (!validateForm(payLoadUpdate)) {
          return
        }
        result = await updateAccount.mutateAsync(payLoadUpdate)
      } else if (action === ACTION.CREATE) {
        if (!validateForm(payLoadCreate)) {
          return
        }
        result = await createAccount.mutateAsync(payLoadCreate)
      }
      if (
        result?.data.message === 'Cập nhật tài khoản thành công' ||
        result?.data.message === 'Thêm tài khoản mới thành công'
      ) {
        toast.success(result?.data.message, {
          autoClose: 3000
        })
        refetch()
        handleClose()
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Email đã tồn tại'
        }))
      }
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {action === ACTION.UPDATE ? (
        <IconButton onClick={handleClickOpen}>
          <Edit />
        </IconButton>
      ) : (
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClickOpen}>
          Thêm tài khoản
        </Button>
      )}
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            position: 'relative'
          },
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        <BackdropCustom loading={updateAccount.isPending} />
        <DialogTitle>{action === ACTION.CREATE ? 'Tạo tài khoản' : 'Chỉnh sửa tài khoản của ' + row?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Tên</Typography>
            </Grid>
            <Grid size={9}>
              <TextField
                fullWidth
                type='text'
                size='small'
                name='name'
                value={name}
                onChange={handleNameChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
          </Grid>
          {ACTION.CREATE === action ? (
            <>
              <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
                <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>Email</Typography>
                </Grid>
                <Grid size={9}>
                  <TextField
                    type='email'
                    fullWidth
                    size='small'
                    name='email'
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
                <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>Mật khẩu</Typography>
                </Grid>
                <Grid size={9}>
                  <TextField
                    type='password'
                    fullWidth
                    size='small'
                    name='password'
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
          {role === AccountRole.Manager || role === AccountRole.Staff ? (
            <>
              <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
                <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>Chi nhánh</Typography>
                </Grid>
                <Grid size={9}>
                  <Select
                    name='buildingNumber'
                    fullWidth
                    size='small'
                    value={buildingNumber}
                    onChange={handleBuildingNumberChange}
                    error={!!errors.buildingNumber}
                  >
                    {allBuilding?.map((building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.address}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.buildingNumber && (
                    <Typography color='error' variant='caption'>
                      {errors.buildingNumber}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            {(row.role !== ACOUNT_ROLE.ADMIN && ACTION.UPDATE === action) || ACTION.CREATE === action ? (
              <>
                <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>Vai trò</Typography>
                </Grid>
                <Grid size={9}>
                  <Select
                    name='role'
                    fullWidth
                    size='small'
                    value={role}
                    onChange={handleRoleChange}
                    error={!!errors.role}
                    disabled={row.role === AccountRole.Customer && ACTION.UPDATE === action}
                  >
                    {availableRoles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.role && (
                    <Typography color='error' variant='caption'>
                      {errors.role}
                    </Typography>
                  )}
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Trạng thái</Typography>
            </Grid>
            <Grid size={9}>
              <Select
                name='status'
                fullWidth
                size='small'
                value={status}
                onChange={handleStatusChange}
                error={!!errors.status}
              >
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={0}>Không hoạt động</MenuItem>
              </Select>
              {errors.status && (
                <Typography color='error' variant='caption'>
                  {errors.status}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='error'>
            Hủy
          </Button>
          <Button type='submit' color='success'>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserModal

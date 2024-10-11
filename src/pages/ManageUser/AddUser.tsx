import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useState } from 'react'
import { AccountRole } from '~/constants/type'
import { useCreateAccountMutation } from '~/queries/useAccount'
import AddIcon from '@mui/icons-material/Add'
import { CreateAccountBodyType } from '~/schemaValidations/account.schema'
import { toast } from 'react-toastify'
import { handleErrorApi } from '~/utils/utils'

export default function AddUser() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState(AccountRole.Customer.toString())
  const [status, setStatus] = useState<number>(1) // Default to active (1)
  const createAccount = useCreateAccountMutation()

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string)
  }

  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setStatus(event.target.value as number)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button onClick={handleClickOpen} color='primary' startIcon={<AddIcon />}>
        Thêm tài khoản
      </Button>
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (createAccount.isPending) return
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries()) as unknown as CreateAccountBodyType
            try {
              await createAccount.mutateAsync({
                ...formJson,
                status: status // Use the status state
              })
              toast.success('Thêm mới tài khoản thành công', {
                autoClose: 3000
              })
            } catch (error) {
              handleErrorApi({ error })
            }
            handleClose()
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '20px', fontWeight: '500' }}>Thêm tài khoản</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Tên</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth type='text' size='small' name='name' required />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Email</Typography>
            </Grid>
            <Grid size={9}>
              <TextField type='email' fullWidth size='small' name='email' required />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Mật khẩu</Typography>
            </Grid>
            <Grid size={9}>
              <TextField type='password' fullWidth size='small' name='password' required />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Vai trò</Typography>
            </Grid>
            <Grid size={9}>
              <Select name='role' fullWidth size='small' value={role} onChange={handleRoleChange} required>
                {Object.values(AccountRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Trạng thái</Typography>
            </Grid>
            <Grid size={9}>
              <Select name='status' fullWidth size='small' value={status} onChange={handleStatusChange} required>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={0}>Không hoạt động</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: 'grey.900', borderRadius: '12px' }}>
            Hủy
          </Button>
          <Button
            size='medium'
            type='submit'
            variant='contained'
            sx={{ backgroundColor: 'grey.900', borderRadius: '12px' }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

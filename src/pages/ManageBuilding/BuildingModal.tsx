import { Edit } from '@mui/icons-material'
import { IconButton, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useState } from 'react'
import { ACTION } from '~/constants/mock'
import { Building } from '~/constants/type'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import { useCreateBuildingMutation, useEditBuildingMutation } from '~/queries/useBuilding'
import {
  BuildingStatus,
  CreateBuildingBody,
  CreateBuildingBodyType,
  EditBuildingBody,
  EditBuildingBodyType
} from '~/schemaValidations/building.schema'
import { handleErrorApi } from '~/utils/utils'
import { toast } from 'react-toastify'
import { z } from 'zod'
import BackdropCustom from '~/components/Progress/Backdrop'

export default function BuildingModal({ row, action }: { row?: Building; action: string }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(row?.status || BuildingStatus.Active)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const createBuilding = useCreateBuildingMutation()
  const editBuildingMutation = useEditBuildingMutation()

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string)
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
      validationSchema = CreateBuildingBody
    } else {
      validationSchema = EditBuildingBody
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
    if (createBuilding.isPending || editBuildingMutation.isPending) return
    const formData = new FormData(event.currentTarget)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formJson = Object.fromEntries((formData as any).entries())
    const payloadUpdate = {
      id: row?.id,
      ...formJson
    }
    try {
      let result
      if (action === ACTION.UPDATE) {
        console.log(action)
        if (!validateForm(payloadUpdate)) {
          console.log(payloadUpdate)
          return
        }
        result = await editBuildingMutation.mutateAsync(payloadUpdate as EditBuildingBodyType)
      } else if (action === ACTION.CREATE) {
        console.log(action)
        if (!validateForm(formJson)) {
          return
        }
        result = await createBuilding.mutateAsync(formJson as CreateBuildingBodyType)
      }
      toast.success(result?.data.message, {
        autoClose: 3000
      })
    } catch (error) {
      handleErrorApi({ error })
    }
    handleClose()
  }
  return (
    <>
      {action === ACTION.UPDATE ? (
        <IconButton onClick={handleClickOpen}>
          <Edit />
        </IconButton>
      ) : (
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={handleClickOpen}>
          Thêm chi nhánh
        </Button>
      )}
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        <BackdropCustom loading={createBuilding.isPending || editBuildingMutation.isPending} />
        <DialogTitle sx={{ fontSize: '20px', fontWeight: '500' }}>
          {action === ACTION.CREATE ? 'Tạo chi nhánh' : 'Chỉnh sửa chi nhánh'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Chi nhánh</Typography>
            </Grid>
            <Grid size={9}>
              <TextField
                fullWidth
                size='small'
                name='address'
                defaultValue={row?.address}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Hotline</Typography>
            </Grid>
            <Grid size={9}>
              <TextField
                fullWidth
                size='small'
                name='hotlineNumber'
                defaultValue={row?.hotlineNumber}
                error={!!errors.hotlineNumber}
                helperText={errors.hotlineNumber}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'start' }}>
              <Typography>Mô tả</Typography>
            </Grid>
            <Grid size={9}>
              <TextField
                name='description'
                style={{ width: '100%', fontFamily: 'inherit', fontSize: 'inherit' }}
                minRows={2}
                maxRows={6}
                defaultValue={row?.description}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
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
                onChange={handleChange}
                error={!!errors.status}
              >
                {Object.values(BuildingStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: 'grey.900', borderRadius: '12px' }}>
            Hủy
          </Button>
          <Button size='medium' type='submit' variant='contained' color='primary' sx={{ borderRadius: '12px' }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

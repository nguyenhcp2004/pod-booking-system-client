import { Edit } from '@mui/icons-material'
import { IconButton, MenuItem, Select, SelectChangeEvent, TextareaAutosize, Typography } from '@mui/material'
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
import { BuildingStatus, CreateBuildingBodyType, EditBuildingBodyType } from '~/schemaValidations/building.schema'
import { handleErrorApi } from '~/utils/utils'
import { toast } from 'react-toastify'

export default function BuildingModal({ row, action }: { row?: Building; action: string }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(row?.status || BuildingStatus.Active)
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
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (createBuilding.isPending) return
            const formData = new FormData(event.currentTarget)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formJson = Object.fromEntries((formData as any).entries())
            const payload = {
              ...row,
              ...formJson
            }
            try {
              const result =
                ACTION.CREATE === action
                  ? await createBuilding.mutateAsync(formJson as CreateBuildingBodyType)
                  : await editBuildingMutation.mutateAsync(payload as EditBuildingBodyType)
              toast.success(result.data.message, {
                autoClose: 3000
              })
            } catch (error) {
              handleErrorApi({ error })
            }
            handleClose()
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '20px', fontWeight: '500' }}>
          {action === ACTION.CREATE ? 'Tạo chi nhánh' : 'Chỉnh sửa chi nhánh'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Chi nhánh</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth size='small' name='address' defaultValue={row?.address} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Hotline</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth size='small' name='hotlineNumber' defaultValue={row?.hotlineNumber} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'start' }}>
              <Typography>Mô tả</Typography>
            </Grid>
            <Grid size={9}>
              <TextareaAutosize
                name='description'
                style={{ width: '100%', padding: '6px', fontFamily: 'inherit', fontSize: 'inherit' }}
                minRows={2}
                maxRows={6}
                maxLength={255}
                defaultValue={row?.description}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Trạng thái</Typography>
            </Grid>
            <Grid size={9}>
              <Select name='status' fullWidth size='small' value={status} onChange={handleChange}>
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

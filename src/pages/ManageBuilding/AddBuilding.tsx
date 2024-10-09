import { MenuItem, Select, SelectChangeEvent, TextareaAutosize, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import { useCreateBuildingMutation } from '~/queries/useBuilding'
import { BuildingStatus, CreateBuildingBodyType } from '~/schemaValidations/building.schema'
import { handleErrorApi } from '~/utils/utils'
import { toast } from 'react-toastify'

export default function AddBuilding() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(BuildingStatus.Active.toString())
  const createBuilding = useCreateBuildingMutation()

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
      <Button
        onClick={handleClickOpen}
        variant='contained'
        sx={{ backgroundColor: 'grey.900', borderRadius: '12px' }}
        startIcon={<AddIcon />}
      >
        Thêm chi nhánh
      </Button>
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
            const formJson = Object.fromEntries((formData as any).entries()) as CreateBuildingBodyType
            try {
              const result = await createBuilding.mutateAsync(formJson)
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
        <DialogTitle sx={{ fontSize: '20px', fontWeight: '500' }}>Thêm chi nhánh</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Chi nhánh</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth size='small' name='address' />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Hotline</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth size='small' name='hotlineNumber' />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'start' }}>
              <Typography>Mô tả</Typography>
            </Grid>
            <Grid size={9}>
              <TextareaAutosize
                name='description'
                style={{ width: '100%', padding: '6px' }}
                minRows={2}
                maxRows={4}
                maxLength={255}
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

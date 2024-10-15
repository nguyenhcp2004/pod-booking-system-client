import { MenuItem, Select, SelectChangeEvent, TextareaAutosize, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import { GetListBuidlingResType } from '~/schemaValidations/building.schema'
import { useEditBuildingMutation } from '~/queries/useBuilding'
import { handleErrorApi } from '~/utils/utils'
import { toast } from 'react-toastify'

interface Props {
  row: GetListBuidlingResType['data'][0]
}
export default function EditBuilding({ row }: Props) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(row.status)
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
      <MenuItem onClick={handleClickOpen} sx={{ borderRadius: '50%', width: '22px', height: '22px', padding: '0' }}>
        <EditIcon sx={{ width: '22px', height: '22px' }} />
      </MenuItem>
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formJson = Object.fromEntries((formData as any).entries())
            const payload = {
              ...row,
              ...formJson
            }
            try {
              const result = await editBuildingMutation.mutateAsync(payload)
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
        <DialogTitle sx={{ fontSize: '20px', fontWeight: '500' }}>Cập nhật chi nhánh</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Chi nhánh</Typography>
            </Grid>
            <Grid size={9}>
              <TextField name='address' fullWidth size='small' defaultValue={row.address} />
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Hotline</Typography>
            </Grid>
            <Grid size={9}>
              <TextField name='hotlineNumber' fullWidth size='small' defaultValue={row.hotlineNumber} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'start' }}>
              <Typography>Mô tả</Typography>
            </Grid>
            <Grid size={9}>
              <TextareaAutosize
                name='description'
                style={{ width: '100%', padding: '8px', fontFamily: 'Roboto', fontSize: '14px' }}
                minRows={2}
                maxRows={5}
                maxLength={255}
                defaultValue={row.description}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Trạng thái</Typography>
            </Grid>
            <Grid size={9}>
              <Select name='status' fullWidth size='small' defaultValue={status} onChange={handleChange}>
                <MenuItem value='Active'>Active</MenuItem>
                <MenuItem value='Under Maintenance'>Under Maintenance</MenuItem>
                <MenuItem value='Closed'>Closed</MenuItem>
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
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

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

interface Props {
  row: GetListBuidlingResType['data'][0]
}
export default function EditBuilding({ row }: Props) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(row.status)

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
      <MenuItem onClick={handleClickOpen}>
        <EditIcon />
        Edit
      </MenuItem>
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formJson = Object.fromEntries((formData as any).entries())
            console.log(formJson)
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
              <TextField name='address' fullWidth size='small' value={row.address} />
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Hotline</Typography>
            </Grid>
            <Grid size={9}>
              <TextField name='hotlineNumber' fullWidth size='small' value={row.hotlineNumber} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'start' }}>
              <Typography>Mô tả</Typography>
            </Grid>
            <Grid size={9}>
              <TextareaAutosize
                name='desciption'
                style={{ width: '100%', padding: '8px', fontFamily: 'Roboto', fontSize: '14px' }}
                minRows={2}
                maxRows={5}
                maxLength={255}
                value={row.description}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Trạng thái</Typography>
            </Grid>
            <Grid size={9}>
              <Select name='status' fullWidth size='small' value={status} onChange={handleChange}>
                <MenuItem value='Available'>Available</MenuItem>
                <MenuItem value='Under Maintenance'>Under Maintenance</MenuItem>
                <MenuItem value='Hidden'>Hidden</MenuItem>
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
import { MenuItem, Select, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'

export default function AddBuilding() {
  const [open, setOpen] = useState(false)

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
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formJson = Object.fromEntries((formData as any).entries())
            const email = formJson.email
            console.log(email)
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
              <TextField fullWidth size='small' />
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Hotline</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth size='small' />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Mô tả</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth size='small' />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Trạng thái</Typography>
            </Grid>
            <Grid size={9}>
              <Select fullWidth size='small'>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
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

import { useState } from 'react'
import { Chip, DialogContentText, MenuItem } from '@mui/material'

import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { GetListBuidlingResType } from '~/schemaValidations/building.schema'

interface Props {
  row: GetListBuidlingResType['data'][0]
}
export default function DeleteBuilding({ row }: Props) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <MenuItem onClick={handleClickOpen} sx={{ color: 'error.main' }}>
        <DeleteIcon />
        Delete
      </MenuItem>
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            // const formData = new FormData(event.currentTarget)
            // // eslint-disable-next-line @typescript-eslint/no-explicit-any
            // const formJson = Object.fromEntries((formData as any).entries())
            // const email = formJson.email
            // console.log(email)
            handleClose()
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '20px', fontWeight: '500' }}>Xóa chi nhánh</DialogTitle>
        <DialogContent>
          <DialogContentText component='p' sx={{ fontSize: '14px' }}>
            Bạn có chắc chắn xóa chi nhánh <Chip component={'span'} label={row.address} />
          </DialogContentText>
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
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

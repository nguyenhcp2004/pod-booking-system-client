import { Edit } from '@mui/icons-material'
import { IconButton, MenuItem, Select, SelectChangeEvent, TextareaAutosize, Typography } from '@mui/material'
import { useState } from 'react'
import { ACTION } from '~/constants/mock'
import { Amenity } from '~/constants/type'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import { useCreateAmenityMutation, useEditAmenityMutation } from '~/queries/useAmenity'
import { AmenityTypeEnum, CreateAmenityBodyType, EditAmenityBodyType } from '~/schemaValidations/amenity.schema'
import { handleErrorApi } from '~/utils/utils'
import { toast } from 'react-toastify'
export default function BuildingModal({ row, action }: { row?: Amenity; action: string }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(row?.type || AmenityTypeEnum.Food)
  const createAmenity = useCreateAmenityMutation()
  const editAmenityMutation = useEditAmenityMutation()

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string)
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
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClickOpen}>
          Thêm dịch vụ
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
            if (createAmenity.isPending) return
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
                  ? await createAmenity.mutateAsync(formJson as CreateAmenityBodyType)
                  : await editAmenityMutation.mutateAsync(payload as EditAmenityBodyType)
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
          {action === ACTION.CREATE ? 'Tạo dịch vụ' : 'Chỉnh sửa dịch vụ'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Dịch vụ</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth size='small' name='name' defaultValue={row?.name} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Giá</Typography>
            </Grid>
            <Grid size={9}>
              <TextField fullWidth size='small' name='price' defaultValue={row?.price} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'start' }}>
              <Typography>Số lượng</Typography>
            </Grid>
            <Grid size={9}>
              <TextareaAutosize
                name='quantity'
                style={{ width: '100%', padding: '6px' }}
                minRows={2}
                maxRows={4}
                maxLength={255}
                defaultValue={row?.quantity}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 2 }} alignContent={'center'} justifyContent={'center'}>
            <Grid size={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Loại dịch vụ</Typography>
            </Grid>
            <Grid size={9}>
              <Select name='type' fullWidth size='small' value={type} onChange={handleChange}>
                {Object.values(AmenityTypeEnum).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
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
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

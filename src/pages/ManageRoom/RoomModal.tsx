import { useCreateRoomMutation, useEditRoomMutation } from '~/queries/useRoom'
import { RoomSchemaType } from '~/schemaValidations/room.schema'
import UploadImage from '~/components/UploadImage/UploadImage'
import BackdropCustom from '~/components/Progress/Backdrop'
import { ACOUNT_ROLE, ACTION, ROOM_STATUS } from '~/constants/mock'
import { handleErrorApi } from '~/utils/utils'
import AddIcon from '@mui/icons-material/Add'
import Edit from '@mui/icons-material/Edit'
import { toast } from 'react-toastify'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { useGetAllBuilding } from '~/queries/useBuilding'
import { useGetRoomTypeByBuildingId } from '~/queries/useRoomType'
import { useAppContext } from '~/contexts/AppProvider'

const RoomModal = ({ row, refetch, action }: { row: RoomSchemaType; refetch: () => void; action: string }) => {
  const { account } = useAppContext()
  console.log(account?.buildingNumber)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<string | null>(row?.image)
  const [status, setStatus] = useState(row?.status)
  const [roomTypeId, setRoomTypeid] = useState(row?.roomType?.id === 0 ? '' : row?.roomType?.id.toString())
  const [buildingId, setBuildingId] = useState(
    account?.role === ACOUNT_ROLE.MANAGER
      ? account.buildingNumber
      : row?.roomType?.building?.id === 0
        ? ''
        : row?.roomType?.building?.id.toString()
  )

  const { data: listBuilding } = useGetAllBuilding()
  const { data: listRoomType, refetch: roomTypeRefetch } = useGetRoomTypeByBuildingId(Number(buildingId))
  useEffect(() => {
    if (buildingId) {
      roomTypeRefetch()
    }
  }, [buildingId, roomTypeRefetch])
  const editRoomMutation = useEditRoomMutation()
  const createRoomMutation = useCreateRoomMutation()

  const handleChangeRoomType = (event: SelectChangeEvent) => {
    setRoomTypeid(event.target.value)
  }

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value)
  }
  const handleChangeBuilding = (event: SelectChangeEvent) => {
    setBuildingId(event.target.value)
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setImage(null)
    setRoomTypeid('')
    setBuildingId('')
  }

  return (
    <>
      {action === ACTION.UPDATE ? (
        <IconButton onClick={handleClickOpen}>
          <Edit />
        </IconButton>
      ) : (
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClickOpen}>
          Thêm phòng
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          sx: {
            position: 'relative'
          },
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formJson = Object.fromEntries((formData as any).entries())
            const payload = {
              ...row,
              ...formJson,
              image: image ?? '',
              roomTypeId: roomTypeId,
              buildingId: buildingId,
              status: status
            }
            try {
              const result =
                action === ACTION.UPDATE
                  ? await editRoomMutation.mutateAsync({
                      ...payload,
                      buildingId: buildingId.toString()
                    })
                  : await createRoomMutation.mutateAsync({
                      ...payload,
                      buildingId: buildingId.toString()
                    })
              toast.success(result.data.message, {
                autoClose: 3000
              })
              refetch()
            } catch (error) {
              handleErrorApi({ error })
            }
            handleClose()
          }
        }}
      >
        <BackdropCustom loading={editRoomMutation.isPending} />
        <DialogTitle>{action === ACTION.CREATE ? 'Tạo phòng' : 'Chỉnh sửa ' + row?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid size={6}>
              <TextField
                fullWidth
                label='Tên phòng'
                name='name'
                defaultValue={row?.name}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth size='small' required>
                <InputLabel>Chi nhánh</InputLabel>
                <Select
                  label='Chi nhánh'
                  value={buildingId?.toString()}
                  onChange={handleChangeBuilding}
                  disabled={account?.role === ACOUNT_ROLE.MANAGER}
                >
                  {listBuilding?.data.data.map((building) => (
                    <MenuItem key={building?.id} value={building?.id}>
                      {building?.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth size='small' required>
                <InputLabel>Loại phòng</InputLabel>
                <Select label='Loại phòng' value={roomTypeId?.toString()} onChange={handleChangeRoomType}>
                  {listRoomType?.data.data.map((roomType) => (
                    <MenuItem key={roomType?.id} value={roomType?.id.toString()}>
                      {roomType?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth size='small' required>
                <InputLabel>Trạng thái</InputLabel>
                <Select label='Trạng thái' value={status} onChange={handleChangeStatus}>
                  {Object.entries(ROOM_STATUS).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Mô tả'
                name='description'
                defaultValue={row?.description}
                variant='outlined'
                size='small'
                multiline
                maxRows={4}
                required
              />
            </Grid>
            <Grid size={12}>
              <UploadImage image={image || ''} setImage={setImage} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='error'>
            Hủy
          </Button>
          <Button type='submit' color='success'>
            {action === ACTION.CREATE ? 'Tạo' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RoomModal

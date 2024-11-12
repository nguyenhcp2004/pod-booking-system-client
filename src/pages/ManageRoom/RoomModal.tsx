import { useCreateRoomMutation, useEditRoomMutation } from '~/queries/useRoom'
import { RoomSchemaType } from '~/schemaValidations/room.schema'
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
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { useGetAllBuilding } from '~/queries/useBuilding'
import { useGetRoomTypeByBuildingId } from '~/queries/useRoomType'
import { useAppContext } from '~/contexts/AppProvider'
import UploadImage from '~/components/UploadImage/UploadImage'
import { useAddImageToRoomMutation, useGetImagesByRoomId, useUploadImageToCloud } from '~/queries/useImage'
import { Image } from '~/constants/type'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const roomSchema = z.object({
  name: z
    .string()
    .min(5, 'Tên phòng phải có ít nhất 5 ký tự')
    .max(50, 'Tên phòng không được quá 50 ký tự')
    .regex(/^[a-zA-Z0-9\s]*$/, 'Tên phòng không được sử dụng kí tự đặc biệt')
    .trim(),
  description: z
    .string()
    .min(10, 'Mô tả phòng phải có ít nhất 10 ký tự')
    .max(1000, 'Mô tả phòng không được quá 1000 ký tự'),
  roomTypeId: z.union([
    z.string().min(1, { message: 'Loại phòng là bắt buộc' }),
    z.number().min(1, { message: 'Loại phòng là bắt buộc' })
  ]),
  buildingId: z.union([
    z.string().min(1, { message: 'Chi nhánh là bắt buộc' }),
    z.number().min(1, { message: 'Chi nhánh là bắt buộc' })
  ]),
  status: z.string()
})

const RoomModal = ({ row, refetch, action }: { row: RoomSchemaType; refetch: () => void; action: string }) => {
  const { account } = useAppContext()
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const { data: listBuilding } = useGetAllBuilding()

  const uploadImage = useUploadImageToCloud()
  const editRoomMutation = useEditRoomMutation()
  const createRoomMutation = useCreateRoomMutation()
  const addImageToRoomMutation = useAddImageToRoomMutation()

  const { data: imagesData, refetch: imagesRefetch } = useGetImagesByRoomId(row?.id)

  const {
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: row?.name || '',
      description: row?.description || '',
      roomTypeId: row?.roomType?.id === 0 ? '' : row?.roomType?.id.toString(),
      buildingId:
        row?.roomType?.building?.id === 0
          ? account?.role === ACOUNT_ROLE.MANAGER
            ? account.buildingNumber.toString()
            : ''
          : row?.roomType?.building?.id.toString(),
      status: row?.status || 'Available'
    }
  })
  const { data: listRoomType, refetch: roomTypeRefetch } = useGetRoomTypeByBuildingId(Number(watch('buildingId')))

  useEffect(() => {
    if (imagesData) {
      setImages(imagesData.data.data)
    }
  }, [imagesData])

  useEffect(() => {
    if (watch('buildingId')) {
      roomTypeRefetch()
      setValue('roomTypeId', '')
    }
  }, [watch('buildingId')])

  const handleUpload = async ({ roomId }: { roomId: number }) => {
    const uploadImagePromise: Promise<any>[] = selectedFiles.map((file) =>
      uploadImage.mutateAsync(file).then((data) => data)
    )
    return Promise.all(uploadImagePromise).then((data) => {
      addImageToRoomMutation.mutateAsync({
        roomId: roomId,
        image: data
      })
    })
  }

  const handleClickOpen = () => {
    roomTypeRefetch().then(() => {
      setOpen(true)
      setValue('roomTypeId', row?.roomType?.id === 0 ? '' : row?.roomType?.id.toString())
    })
  }

  const handleClose = () => {
    setValue('name', row?.name || '')
    setValue('description', row?.description || '')
    setValue('roomTypeId', row?.roomType?.id === 0 ? '' : row?.roomType?.id.toString())
    setValue(
      'buildingId',
      row?.roomType?.building?.id === 0
        ? account?.role === ACOUNT_ROLE.MANAGER
          ? account.buildingNumber.toString()
          : ''
        : row?.roomType?.building?.id.toString()
    )
    setValue('status', row?.status || 'Available')
    setOpen(false)
  }

  const onSubmit = async (data: any) => {
    const payload = {
      ...row,
      ...data,
      buildingId: Number(data.buildingId),
      roomTypeId: Number(data.roomTypeId),
      status: data.status
    }
    try {
      const result =
        action === ACTION.UPDATE
          ? await editRoomMutation.mutateAsync(payload).then((data) => {
              handleUpload({ roomId: row.id }).then(() => {
                imagesRefetch()
              })
              return data
            })
          : await createRoomMutation.mutateAsync(payload).then((data) => {
              handleUpload({ roomId: data.data.data.id }).then(() => {
                imagesRefetch()
              })
              return data
            })
      refetch()
      toast.success(result.data.message, { autoClose: 3000 })
      handleClose()
    } catch (error) {
      handleErrorApi({ error })
    }
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
      <Dialog open={open} onClose={handleClose} fullWidth>
        <BackdropCustom loading={editRoomMutation.isPending} />
        <DialogTitle>{action === ACTION.CREATE ? 'Tạo phòng' : 'Chỉnh sửa ' + row?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid size={6}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Tên phòng'
                    variant='outlined'
                    size='small'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth size='small' required>
                <InputLabel>Chi nhánh</InputLabel>
                <Controller
                  name='buildingId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Chi nhánh'
                      onChange={(event) => {
                        setValue('buildingId', event.target.value)
                        field.onChange(event)
                      }}
                      disabled={account?.role === ACOUNT_ROLE.MANAGER}
                      error={!!errors.buildingId}
                    >
                      {listBuilding?.data.data.map((building) => (
                        <MenuItem key={building?.id} value={building?.id}>
                          {building?.address}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText error>{errors.buildingId?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth size='small' required>
                <InputLabel>Loại phòng</InputLabel>
                <Controller
                  name='roomTypeId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Loại phòng'
                      onChange={(event) => {
                        setValue('roomTypeId', event.target.value)
                        field.onChange(event)
                      }}
                      error={!!errors.roomTypeId}
                    >
                      {listRoomType?.data.data.map((roomType) => (
                        <MenuItem key={roomType?.id} value={roomType?.id.toString()}>
                          {roomType?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText error>{errors.roomTypeId?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth size='small' required>
                <InputLabel>Trạng thái</InputLabel>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Trạng thái'
                      onChange={(event) => {
                        setValue('status', event.target.value)
                        field.onChange(event)
                      }}
                      error={!!errors.status}
                    >
                      {Object.entries(ROOM_STATUS).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText error>{errors.status?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Mô tả'
                    variant='outlined'
                    size='small'
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <UploadImage images={images} setSelectedFiles={setSelectedFiles} refetch={imagesRefetch} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='error'>
            Hủy
          </Button>
          <Button type='submit' onClick={handleSubmit(onSubmit)} color='success'>
            {action === ACTION.CREATE ? 'Tạo' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RoomModal

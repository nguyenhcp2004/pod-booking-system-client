import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import imageApiRequets from '~/apis/image'

export const useUploadImageToCloud = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: imageApiRequets.uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upload-image'] })
    }
  })
}
export const useGetImagesByRoomId = (roomId: number) => {
  return useQuery({
    queryKey: ['get-image-by-room-id', { roomId }],
    queryFn: () => imageApiRequets.getImagesByRoomId(roomId),
    enabled: !!roomId
  })
}
export const useAddImageToRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: imageApiRequets.addImageToRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['add-image-to-room'] })
    }
  })
}

export const useDeleteImageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: imageApiRequets.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delete-image'] })
    }
  })
}

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
    queryFn: () => imageApiRequets.getImagesByRoomId(roomId)
  })
}
export const useAddImageToRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: imageApiRequets.addImageToRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['add-image-to-room'] })
    }
  })
}

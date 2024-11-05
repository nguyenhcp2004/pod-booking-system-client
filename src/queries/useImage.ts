import { useMutation, useQueryClient } from '@tanstack/react-query'
import imageApiRequets from '~/apis/image'

export const useUploadImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: imageApiRequets.uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upload-image'] })
    }
  })
}

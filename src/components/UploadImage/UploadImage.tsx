import { Box, Button, Grid, IconButton } from '@mui/material'
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { Image } from '~/constants/type'
import { useDeleteImageMutation } from '~/queries/useImage'

const UploadImage = ({
  images,
  setSelectedFiles,
  refetch
}: {
  images: Image[]
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
  refetch: () => void
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList)
    setSelectedFiles((prevFiles: File[]) => [...prevFiles, ...files])
    const previews = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(previews)
  }

  const handleRemovePreview = (index: number): void => {
    setPreviewUrls((prevUrls: string[]) => prevUrls.filter((_, i: number) => i !== index))
    setSelectedFiles((prevFiles: File[]) => prevFiles.filter((_, i: number) => i !== index))
  }
  const deleteImageMutation = useDeleteImageMutation()
  const handleRemove = (imageId: number) => {
    deleteImageMutation.mutateAsync(imageId).then(() => {
      refetch()
    })
  }
  return (
    <Box>
      <Button variant='contained' component='label' startIcon={<CloudUploadIcon />}>
        Chọn ảnh
        <input type='file' hidden multiple accept='image/*' onChange={handleFileChange} />
      </Button>
      <Box sx={{ mt: 2, overflowX: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {previewUrls.map((url, index) => (
          <Box sx={{ position: 'relative' }} key={index}>
            <img src={url} alt={`Preview ${index}`} width='200px' />
            <IconButton
              color='secondary'
              onClick={() => handleRemovePreview(index)}
              sx={{ position: 'absolute', top: 5, right: 5 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((image) => (
          <Grid item xs={4} key={image.id}>
            <Box sx={{ position: 'relative' }}>
              <img src={image.imageUrl} alt={`Preview ${image.id}`} width='100%' />
              <IconButton
                color='secondary'
                onClick={() => handleRemove(image.id)}
                sx={{ position: 'absolute', top: 5, right: 5 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default UploadImage

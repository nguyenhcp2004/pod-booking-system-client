import { Box, Button, Grid, IconButton } from '@mui/material'
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useUploadImage } from '~/queries/useImage'
import { useEffect, useState } from 'react'

const UploadImage = ({
  selectedFiles,
  setSelectedFiles
}: {
  selectedFiles: File[]
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
}) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
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

  const handleRemove = (index: number): void => {
    setUploadedUrls((prevUrls: string[]) => prevUrls.filter((_, i: number) => i !== index))
  }

  return (
    <Box>
      <Button variant='contained' component='label' startIcon={<CloudUploadIcon />}>
        Chọn ảnh
        <input type='file' hidden multiple accept='image/*' onChange={handleFileChange} />
      </Button>

      {/* <Box mt={2}>
        <Button variant='contained' onClick={handleUpload} disabled={!selectedFiles.length}>
          Tải lên ảnh
        </Button>
      </Box> */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {previewUrls.map((url, index) => (
          <Grid item xs={4} key={index}>
            <Box sx={{ position: 'relative' }}>
              <img src={url} alt={`Preview ${index}`} width='100%' />
              <IconButton
                color='secondary'
                onClick={() => handleRemovePreview(index)}
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

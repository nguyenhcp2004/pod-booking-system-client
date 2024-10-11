import { useMutation } from '@tanstack/react-query'

const cloud_name: string = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const upload_preset: string = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

const uploadMedia = async (pics: File): Promise<string> => {
  const data = new FormData()
  data.append('file', pics)
  data.append('upload_preset', upload_preset)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
    method: 'POST',
    body: data
  })

  if (!res.ok) {
    throw new Error('Failed to upload image')
  }

  const fileData = await res.json()
  return fileData.url
}

export const useUploadMedia = () => {
  return useMutation<string, Error, File>({
    mutationFn: uploadMedia
  })
}

// import React, { useState } from 'react'
// import { useUploadMedia } from '~/utils/uploadCloudnary'
// import { Button, CircularProgress, Typography, Card, CardMedia, Backdrop, Box } from '@mui/material'

// const UploadComponent: React.FC = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const { mutate, status, isError, isSuccess, data, error } = useUploadMedia()

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0])
//     }
//   }

//   const handleUpload = () => {
//     if (selectedFile) {
//       mutate(selectedFile)
//     }
//   }

//   return (
//     <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <Typography variant='h6' gutterBottom>
//         Upload an Image
//       </Typography>

//       <Button variant='contained' component='label'>
//         Select File
//         <input type='file' hidden onChange={handleFileChange} />
//       </Button>

//       {selectedFile && (
//         <Typography variant='body1' gutterBottom>
//           {selectedFile.name}
//         </Typography>
//       )}

//       <Button
//         variant='contained'
//         color='primary'
//         onClick={handleUpload}
//         disabled={status === 'pending' || !selectedFile}
//         style={{ marginTop: 16 }}
//       >
//         Upload
//       </Button>

//       {isError && <Typography color='error'>Error uploading image: {error?.message}</Typography>}
//       {isSuccess && data && (
//         <>
//           <Typography variant='body2' color='textSecondary' style={{ marginTop: 16 }}>
//             Image uploaded successfully: {data}
//           </Typography>
//           <Card style={{ maxWidth: 400, marginTop: 16 }}>
//             <CardMedia component='img' height='300' image={data} alt='Uploaded Image' />
//           </Card>
//         </>
//       )}
//       <Backdrop open={status === 'pending'} style={{ zIndex: 1300, color: '#fff' }}>
//         <CircularProgress color='inherit' />
//       </Backdrop>
//     </Box>
//   )
// }

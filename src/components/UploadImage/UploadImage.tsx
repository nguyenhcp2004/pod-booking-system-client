import React, { Dispatch, useEffect } from 'react'
import { useUploadMedia } from '~/utils/uploadCloudnary'
import { Button, Typography, Box, styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Loading from '../Progress/Loading'
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const UploadImage = ({
  image,
  setImage
}: {
  image: string
  setImage: Dispatch<React.SetStateAction<string | null>>
}) => {
  const { mutate, status, isError, isSuccess, data, error } = useUploadMedia()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      mutate(e.target.files[0])
    }
  }
  useEffect(() => {
    if (isSuccess) {
      setImage(data)
    }
  }, [isSuccess, data, setImage])

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        border: '1px solid #ccc',
        borderStyle: image ? 'solid' : 'dashed',
        position: 'relative',
        minHeight: 200
      }}
      sx={{
        ':hover': { borderStyle: 'solid !important' }
      }}
    >
      <Loading loading={status === 'pending'} />
      {image && <img src={image} alt='' style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
      {isError && <Typography color='error'>Error uploading image: {error?.message}</Typography>}

      <Button
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          opacity: image ? 0 : 1,
          '&:hover': { opacity: 1 }
        }}
        color='inherit'
        component='label'
        role={undefined}
        tabIndex={-1}
      >
        <CloudUploadIcon />
        <VisuallyHiddenInput type='file' onChange={handleFileChange} />
      </Button>
    </Box>
  )
}
export default UploadImage

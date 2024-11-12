import { Box, IconButton, Modal } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { ImageRoomTypeType } from '~/schemaValidations/roomImage.schema'

const ImageView: React.FC<{ images: ImageRoomTypeType[] }> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [imageModal, setImageModal] = useState('')
  const size = 3
  const gap = 24

  const handleNextImage = () => {
    if (currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1)
      if (sliderPosition < images.length - size) {
        setSliderPosition(sliderPosition + 1)
      }
    }
  }

  const handlePrevImage = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1)
      if (sliderPosition > 0) {
        setSliderPosition(sliderPosition - 1)
      }
    }
  }

  const handleImageClick = (image: string) => {
    setImageModal(image)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }
  useEffect(() => {
    setCurrentImage(0)
    setSliderPosition(0)
  }, [images])
  return (
    <Box>
      <img
        src={
          images[0]?.imageUrl ||
          'https://component.gallery/static/7f4dabad1abbb0bdbfdb537ab45c013d/Skeleton%20icon..svg'
        }
        style={{ width: '100%', height: '400px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px' }}
        onClick={() => handleImageClick(images[0]?.imageUrl)}
      />

      {images.length > 0 && (
        <Grid
          container
          size={12}
          columnSpacing={2}
          sx={{ position: 'relative', display: 'flex', alignItems: 'center', borderRadius: '4px' }}
        >
          <IconButton
            disabled={currentImage === 0}
            sx={{
              position: 'absolute',
              height: '100%',
              borderRadius: '0',
              ':hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
            }}
            onClick={handlePrevImage}
            color='secondary'
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Box sx={{ display: 'flex', gap: `${gap / 2}px`, width: '100%', overflow: 'hidden' }}>
            {images.slice(sliderPosition, sliderPosition + size).map((image, index) => (
              <img
                src={
                  image?.imageUrl ||
                  'https://component.gallery/static/7f4dabad1abbb0bdbfdb537ab45c013d/Skeleton%20icon..svg'
                }
                key={index}
                style={{
                  minWidth: `calc(100% / ${size} - ${gap / 3}px)`,
                  height: '200px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onClick={() => handleImageClick(image?.imageUrl)}
              />
            ))}
          </Box>
          <IconButton
            disabled={currentImage === images.length - 1}
            sx={{
              position: 'absolute',
              right: 0,
              height: '100%',
              borderRadius: '0',
              ':hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
            }}
            onClick={handleNextImage}
            color='secondary'
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <img src={imageModal} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>
      </Modal>
    </Box>
  )
}

export default ImageView

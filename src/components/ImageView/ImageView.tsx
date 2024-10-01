import { Box, IconButton, Modal } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useState } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const ImageView: React.FC<{ images: string[] }> = ({ images }) => {
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

  return (
    <>
      <img
        src={images[0]}
        style={{ width: '100%', height: '400px', objectFit: 'cover', cursor: 'pointer' }}
        onClick={() => handleImageClick(images[0])}
      />

      <Grid container size={12} columnSpacing={2} sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <IconButton
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
              src={image}
              key={index}
              style={{
                minWidth: `calc(100% / ${size} - ${gap / 3}px)`,
                height: '100px',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </Box>
        <IconButton
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <img src={imageModal} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>
      </Modal>
    </>
  )
}

export default ImageView

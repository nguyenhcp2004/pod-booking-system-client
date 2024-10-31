import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import { tokens } from '~/themes/theme'
import AddAmenity from './AddAmenity'
import BookingDetails from './BookingDetails'
import QRCodePaymentStaffAmenity from '~/components/QRCodePayment/QRCodePaymentStaffAmenity'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'
import { useCreateOrderDetailAmenityStaff } from '~/queries/useOrderDetailAmenity'
import { handleErrorApi } from '~/utils/utils'
import { toast } from 'react-toastify'
import Loading from '~/components/Progress/Loading'

const CreateAmenityOrderModal = ({
  refetch,
  open,
  handleClose
}: {
  refetch: () => void
  open: boolean
  handleClose: () => void
}) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { clearAll, selectedAmenities, bookedRoom } = useBookingAmenityContext()
  console.log('selectedAmenities', selectedAmenities)
  const [openPayment, setOpenPayment] = useState(false)
  const [loading, setLoading] = useState(false)
  const createOrderDetailAmenityMutation = useCreateOrderDetailAmenityStaff()
  const handleCardPayment = () => {
    setOpenPayment(true)
  }
  const handleOfflinePayment = () => {
    try {
      setLoading(true)
      const apiCall = []
      for (const amenity of selectedAmenities) {
        apiCall.push(
          createOrderDetailAmenityMutation.mutateAsync({
            orderDetailId: bookedRoom?.orderDetailId as string,
            amenityId: amenity.id,
            quantity: amenity.quantity
          })
        )
      }
      Promise.all(apiCall).then(() => {
        setLoading(false)
        clearAll()
        handleClose()
        refetch()
        toast.success('Tạo đơn tiện ích thành công')
      })
    } catch (error) {
      handleErrorApi({ error })
    }
  }
  const handleDone = () => {
    clearAll()
    refetch()
    handleClose()
    setOpenPayment(false)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          sx: {
            position: 'relative',
            background: colors.grey[50],
            minWidth: 1200,
            display: 'flex'
          }
        }}
      >
        <Loading loading={loading} />
        <DialogTitle>
          <Typography variant='h5' fontWeight='500'>
            Tạo đơn tiện ích
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
            sx={{
              borderRadius: 2,
              width: '100%'
            }}
          >
            <Grid size={6}>
              <AddAmenity />
            </Grid>
            <Grid size={6}>
              <BookingDetails />
            </Grid>
            <Grid size={12}>{openPayment && <QRCodePaymentStaffAmenity />}</Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color='error'>
            Hủy
          </Button>

          <Button variant='outlined' onClick={handleOfflinePayment} disabled={loading || !selectedAmenities.length}>
            Thanh toán tiền mặt
          </Button>
          <Button variant='outlined' onClick={handleCardPayment} disabled={loading || !selectedAmenities.length}>
            Thanh toán qua thẻ
          </Button>
          <Button variant='contained' onClick={handleDone} disabled={loading || !selectedAmenities.length}>
            Hoàn thành
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateAmenityOrderModal

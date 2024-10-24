import { Box, Step, StepLabel, Stepper, styled, Dialog, DialogTitle, DialogActions, Button } from '@mui/material'
import { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { tokens } from '~/themes/theme'
import { BookingContext } from '~/contexts/BookingContext'
import { listSteps } from './listSteps'

export interface TransactionData {
  vnp_Amount: string | null
  vnp_BankCode: string | null
  vnp_OrderInfo: string | null
  vnp_ResponseCode: string | null
}

export default function OrderDetail() {
  const { step } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const colors = tokens('light')
  const bookingContext = useContext(BookingContext)

  if (!bookingContext) throw new Error('BookingContext must be used within a BookingProvider')

  const initialStep = Number(step) || 1
  const [activeStep, setActiveStep] = useState(initialStep)
  const [loading, setLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const queryParams = useMemo(() => new URLSearchParams(window.location.search), [])
  const vnp_Amount = queryParams.get('vnp_Amount')

  const transactionData: TransactionData = useMemo(
    () => ({
      vnp_Amount,
      vnp_BankCode: queryParams.get('vnp_BankCode'),
      vnp_OrderInfo: queryParams.get('vnp_OrderInfo'),
      vnp_ResponseCode: queryParams.get('vnp_ResponseCode')
    }),
    [vnp_Amount, queryParams]
  )

  const updateStepFromPath = useCallback(() => {
    const pathStep = Number(location.pathname.split('/').pop()) || 1
    setActiveStep(pathStep - 1)
  }, [location.pathname])

  useEffect(() => {
    window.onpopstate = updateStepFromPath
    return () => {
      window.onpopstate = null
    }
  }, [updateStepFromPath])

  useEffect(() => {
    setActiveStep(vnp_Amount ? 4 : initialStep)
    setLoading(true)
  }, [vnp_Amount, initialStep])

  useEffect(() => {
    const targetPath = `/order-detail/${activeStep}`
    if (activeStep === 4 && location.pathname !== '/order-detail/4') {
      navigate('/order-detail/4', { state: { transactionData } })
    } else if (activeStep !== initialStep && location.pathname !== targetPath) {
      navigate(targetPath)
    }
  }, [activeStep, initialStep, location.pathname, navigate, transactionData])

  const handleNext = () => activeStep < listSteps.length && setActiveStep((prev) => prev + 1)

  const handleBack = () => {
    if (activeStep > 1) {
      navigate(`/order-detail/${activeStep - 1}`)
      setActiveStep((prev) => prev - 1)
    } else setShowConfirmDialog(true)
  }

  const handleConfirmExit = () => {
    setShowConfirmDialog(false)
    navigate('/')
  }

  const CustomStepIcon = styled('div')<{ completed: boolean }>(({ completed }) => ({
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: completed ? colors.primary[500] : colors.grey[500],
    color: 'white',
    fontSize: 12
  }))

  const CurrentStepComponent = listSteps[activeStep - 1]?.element

  return (
    <Box sx={{ bgcolor: colors.grey[50], minHeight: '80vh' }}>
      <Box sx={{ width: '100%', px: '104px', py: '30px' }}>
        <Stepper activeStep={activeStep}>
          {listSteps.map((step) => (
            <Step key={step.index}>
              <StepLabel
                StepIconComponent={() => (
                  <CustomStepIcon completed={step.index <= activeStep}>{step.index}</CustomStepIcon>
                )}
              >
                {step.describe}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep < listSteps.length && (
          <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={handleBack}>
            <KeyboardBackspaceIcon sx={{ position: 'absolute', top: '55px', left: '-40px' }} />
          </Box>
        )}
      </Box>
      <Box sx={{ pb: '30px' }}>
        {loading && CurrentStepComponent && <CurrentStepComponent onNext={handleNext} onBack={handleBack} />}
      </Box>
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Đơn hàng chưa được tạo. Bạn có chắc chắn muốn thoát?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color='primary'>
            Hủy
          </Button>
          <Button onClick={handleConfirmExit} color='secondary'>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

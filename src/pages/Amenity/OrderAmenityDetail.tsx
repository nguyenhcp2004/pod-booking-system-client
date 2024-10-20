import { Box, Step, StepLabel, Stepper, styled } from '@mui/material'
import { listSteps } from './listSteps'
import { useState, useEffect, useMemo } from 'react'
import { tokens } from '~/themes/theme'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'

export interface TransactionData {
  vnp_Amount: string | null
  vnp_BankCode: string | null
  vnp_OrderInfo: string | null
  vnp_ResponseCode: string | null
}

export default function OrderAmenityDetail() {
  const { step } = useParams()
  const location = useLocation()
  const initialStep = Number(step) || 1
  console.log('initialStep', initialStep)
  const [activeStep, setActiveStep] = useState<number>(initialStep)
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), [])
  const colors = tokens('light')
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const bookingAmenityContext = useBookingAmenityContext()
  if (!bookingAmenityContext) {
    throw new Error('BookingContext must be used within a BookingAmenityProvider')
  }

  const vnp_Amount = queryParams.get('vnp_Amount')

  useEffect(() => {
    if (vnp_Amount) {
      setActiveStep(4)
    } else if (step) {
      setActiveStep(initialStep)
    }
    setLoading(true)
  }, [vnp_Amount, step, initialStep])

  useEffect(() => {
    window.onpopstate = () => {
      const pathStep = location.pathname.split('/').pop()
      const currentStep = Number(pathStep) || 1
      setActiveStep(currentStep - 1)
    }
  }, [location.pathname])

  useEffect(() => {
    const currentPath = location.pathname
    const targetPath = `/order-amenity-detail/${activeStep}`

    if (activeStep === 4) {
      const transactionData: TransactionData = {
        vnp_Amount: vnp_Amount,
        vnp_BankCode: queryParams.get('vnp_BankCode'),
        vnp_OrderInfo: queryParams.get('vnp_OrderInfo'),
        vnp_ResponseCode: queryParams.get('vnp_ResponseCode')
      }
      if (currentPath !== '/order-amenity-detail/4') {
        navigate('/order-amenity-detail/4', { state: { transactionData } })
      }
    } else if (activeStep !== initialStep && currentPath !== targetPath) {
      navigate(targetPath)
    }
  }, [activeStep, loading, initialStep, navigate, vnp_Amount, queryParams, location.pathname])

  const handleNext = () => {
    if (activeStep < listSteps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 1) {
      navigate(`/order-detail/${activeStep - 1}`)
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
  }

  const commonProps = {
    onNext: handleNext,
    onBack: handleBack
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

  const CurrentStepComponent = listSteps[activeStep - 1].element

  return (
    <Box sx={{ bgcolor: colors.grey[50], minHeight: '80vh' }}>
      <Box sx={{ width: '100%', paddingX: '104px', paddingY: '30px' }}>
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
      <Box sx={{ paddingBottom: '30px' }}>{loading ? <CurrentStepComponent {...commonProps} /> : ''}</Box>
    </Box>
  )
}

import { Box, Step, StepLabel, Stepper, styled } from '@mui/material'
import { listSteps } from './listSteps'
import { useState, useEffect, useContext } from 'react'
import { tokens } from '~/themes/theme'
import { BookingContext } from '~/contexts/BookingContext'
import { useParams, useNavigate } from 'react-router-dom'

export default function OrderDetail() {
  const { step } = useParams()
  const initialStep = step ? Number(step) : 1
  const [activeStep, setActiveStep] = useState<number>(initialStep)
  const colors = tokens('light')
  const navigate = useNavigate()

  const bookingContext = useContext(BookingContext)
  if (!bookingContext) {
    throw new Error('BookingContext must be used within a BookingProvider')
  }

  useEffect(() => {
    navigate(`/order-detail/${activeStep}`, { replace: true })
  }, [activeStep, navigate])

  const handleNext = () => {
    if (activeStep >= listSteps.length) return
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    if (activeStep <= 1) return
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
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
      <Box sx={{ width: '100%', paddingX: '104px', paddingTop: '48px' }}>
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
      </Box>
      <Box sx={{ paddingY: '24px' }}>
        <CurrentStepComponent {...commonProps} />
      </Box>
    </Box>
  )
}

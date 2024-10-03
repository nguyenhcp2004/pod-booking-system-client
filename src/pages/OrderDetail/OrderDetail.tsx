import { Box, Step, StepLabel, Stepper, styled } from '@mui/material'
import { listSteps } from './listSteps'
import { useState, useEffect } from 'react'
import { tokens } from '~/themes/theme'

export default function OrderDetail() {
  const initialStep = Number(localStorage.getItem('activeStep')) || 1
  const [activeStep, setActiveStep] = useState<number>(initialStep)
  const colors = tokens('light')

  useEffect(() => {
    localStorage.setItem('activeStep', activeStep.toString())
  }, [activeStep])

  const handleNext = () => {
    if (activeStep >= listSteps.length) {
      return
    }
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

  return (
    <Box sx={{ bgcolor: colors.grey[50], minHeight: '80vh' }}>
      <Box sx={{ width: '100%', paddingX: '104px', paddingY: '24px', paddingTop: '48px' }}>
        <Stepper activeStep={activeStep}>
          {listSteps.map((step) => (
            <Step key={step.index}>
              <StepLabel
                StepIconComponent={() => (
                  <CustomStepIcon completed={step.index <= activeStep ? true : false}>{step.index}</CustomStepIcon>
                )}
              >
                {step.describe}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box>{listSteps[activeStep - 1].element({ ...commonProps })}</Box>
    </Box>
  )
}

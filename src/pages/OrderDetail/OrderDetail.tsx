import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  styled
} from '@mui/material'
import { listSteps } from './listSteps'
import { useState } from 'react'
import { tokens } from '~/themes/theme'

export default function OrderDetail() {
  const [activeStep, setActiveStep] = useState<number>(1)
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const colors = tokens('light')

  const handleNext = () => {
    setOpenConfirmDialog(true)
  }

  const handleBack = () => {
    if (activeStep <= 1) return
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    console.log(activeStep)
  }

  const handleConfirm = () => {
    setOpenConfirmDialog(false)
    if (activeStep >= listSteps.length) {
      return
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    console.log(activeStep)
  }

  const handleCancel = () => {
    setOpenConfirmDialog(false)
  }

  const commonProps = {
    onNext: handleNext,
    onBack: handleBack,
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
      <Box sx={{ width: '100%', paddingX: '104px', paddingY: '48px' }}>
        <Stepper activeStep={1}>
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
      <Box sx={{ marginTop: '24px' }}>{listSteps[activeStep - 1].element({ ...commonProps })}</Box>
      <Dialog open={openConfirmDialog} onClose={handleCancel}>
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn đã xác nhận thông tin?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Hủy bỏ</Button>
          <Button onClick={handleConfirm} variant='contained'>
            Xác nhận{' '}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

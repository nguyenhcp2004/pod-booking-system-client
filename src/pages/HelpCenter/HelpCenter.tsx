import { Typography, Container, Accordion, AccordionSummary, AccordionDetails, Box, Button, Paper } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import InfoIcon from '@mui/icons-material/Info'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import CallIcon from '@mui/icons-material/Call'

const faqs = [
  {
    question: 'Các loại phòng làm việc nào có sẵn để thuê?',
    answer:
      'Chúng tôi cung cấp nhiều loại phòng làm việc, bao gồm phòng họp, phòng làm việc cá nhân, và không gian làm việc chung.'
  },
  {
    question: 'Có cần đặt phòng trước không?',
    answer:
      'Có, chúng tôi khuyến khích bạn đặt phòng trước để đảm bảo rằng bạn có không gian phù hợp theo yêu cầu của mình.'
  },
  {
    question: 'Thời gian thuê phòng là bao lâu?',
    answer: 'Bạn có thể thuê phòng theo giờ, theo ngày hoặc theo tuần, tùy thuộc vào nhu cầu của bạn.'
  },
  {
    question: 'Có chính sách hủy đặt phòng không?',
    answer:
      'Có, bạn có thể hủy đặt phòng theo chính sách hủy của chúng tôi. Vui lòng tham khảo trang chính sách hủy để biết thêm chi tiết.'
  },
  {
    question: 'Có các tiện nghi nào đi kèm với phòng làm việc?',
    answer:
      'Mỗi phòng làm việc đều được trang bị các tiện nghi như Wi-Fi, máy chiếu, bảng trắng và thiết bị văn phòng khác. Một số phòng cũng có thêm dịch vụ như cà phê và đồ ăn nhẹ.'
  }
]

export default function HelpCenter() {
  return (
    <Container maxWidth='lg' sx={{ my: 5 }}>
      <Paper elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <Typography variant='body1' color='neutral' marginBottom={3}>
          Trung tâm trợ giúp
        </Typography>
        <Accordion sx={{ mb: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-a-content`} id={`panel-a-header`}>
            <Typography fontWeight={'bold'} display={'flex'} alignItems={'center'} fontSize='0.875rem'>
              {' '}
              <InfoIcon sx={{ mr: 1, width: 24, height: 24 }} color='error' /> Bảo mật online
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Bảo vệ an toàn của bản thân bằng cách không chia sẻ thông tin cá nhân hay thẻ tín dụng qua cuộc gọi, email
              hay tin nhắn.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Typography variant='h4' fontWeight={'bold'} gutterBottom mb={2}>
          Chào mừng bạn đến với Trung tâm Trợ giúp
        </Typography>
        <Typography variant='body1' fontSize={'0.875rem'} gutterBottom mb={2}>
          Đăng nhập để liên hệ Dịch vụ Khách hàng, chúng tôi luôn túc trực 24/7
        </Typography>
        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', p: 2 }}>
            <Box sx={{ padding: 2 }} display={'flex'} alignItems={'flex-start'} gap={1.5}>
              <Box>
                <QuestionAnswerIcon />
              </Box>
              <Box>
                <Typography variant='h6'>Gửi tin nhắn cho chúng tôi</Typography>
                <Typography variant='body1' color='neutral' fontSize={'0.875rem'}>
                  Liên hệ với nhân viên chúng tôi về đơn đặt của bạn và chúng tôi sẽ phản hồi ngay khi có thể.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ padding: 2 }} display={'flex'} alignItems={'flex-start'} gap={1.5}>
              <Box>
                <CallIcon />
              </Box>
              <Box>
                <Typography variant='h6'>Gọi cho chúng tôi</Typography>
                <Typography variant='body1' color='neutral' fontSize={'0.875rem'}>
                  Trong trường hợp khẩn cấp, bạn có thể gọi cho chúng tôi 24/7 bằng số địa phương hoặc quốc tế.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mx: 2 }}>
            <Button sx={{ my: 2, padding: 2 }} fullWidth variant='contained'>
              {' '}
              Liên hệ{' '}
            </Button>
          </Box>
        </Box>
        <Typography variant='h5' fontWeight={'bold'} gutterBottom mb={2}>
          Các câu hỏi thường gặp
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  )
}

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function AboutUs() {
  const teamMembers = [
    { name: 'Jane Doe', role: 'CEO', image: '/placeholder.svg?height=200&width=200' },
    { name: 'John Smith', role: 'CTO', image: '/placeholder.svg?height=200&width=200' },
    { name: 'Alice Johnson', role: 'Head of Design', image: '/placeholder.svg?height=200&width=200' }
  ]

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

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        <Typography
          variant='h2'
          sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '2rem', md: '3rem' }, mb: 4 }}
          color='primary'
        >
          Về FlexiPod
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle1' color='neutral' sx={{ mb: 4 }}>
              Được thành lập vào tháng 6 năm nay. FlexiPod.com đã phát triển từ một nhóm khởi nghiệp nhỏ để trở thành
              một trong các công ty chuyên cung cấp các dịch vụ đặt phòng dựa trên nền tảng số hóa. Với đội ngũ đầy
              nhiệt huyết và chuyên nghiệp, FlexiPod cam kết cung cấp dịch vụ xuất sắc, từ trải nghiệm đặt phòng trực
              tuyến đến hỗ trợ khách hàng tận tình.
            </Typography>
            <Typography variant='subtitle1' color='neutral'>
              Chúng tôi không ngừng cải tiến hệ thống để đáp ứng nhu cầu ngày càng cao của khách hàng, đảm bảo rằng mỗi
              khách hàng đều có trải nghiệm làm việc thoải mái và hiệu quả nhất tại FlexiPod.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component='img'
              sx={{
                height: 300,
                width: '100%',
                maxHeight: { xs: 300, md: 400 },
                maxWidth: { xs: 350, md: 500 },
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              alt='Printing facility'
              src='https://i.pinimg.com/564x/cb/33/05/cb330518abfb359e559141e2f9c0c54b.jpg'
            />
          </Grid>
        </Grid>

        <Box sx={{ my: 8 }}>
          <Typography
            variant='h4'
            sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '2rem', md: '3rem' }, mb: 4 }}
            color='primary'
          >
            Đội ngũ
          </Typography>
          <Grid container spacing={4} justifyContent='center'>
            {teamMembers.map((member) => (
              <Grid item key={member.name} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    boxShadow: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component='img'
                    height='200'
                    image='https://i.pinimg.com/736x/97/92/cf/9792cf7e99d1927846f81f6258b586cc.jpg'
                    alt={member.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {member.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ my: 8 }}>
          <Typography variant='h4' component='h2' gutterBottom align='center' sx={{ mb: 4 }}>
            Câu hỏi thường gặp
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                <Typography fontWeight={'bold'}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant='h4' component='h2' gutterBottom>
            Sẵn sàng đặt phòng?
          </Typography>
          <Button variant='contained' size='large' sx={{ mt: 2 }}>
            Đặt phòng
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { tokens } from '~/themes/theme'

export default function FAQList() {
  const colors = tokens('light')
  return (
    <Box
      sx={{
        bgcolor: 'white',
        padding: '20px',
        borderRadius: 2,
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
      }}
    >
      <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700', marginBottom: '1rem' }}>
        Câu hỏi thường gặp khi hủy phòng
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
          <Typography fontWeight='bold'>Điều kiện hủy phòng miễn phí là gì?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Để hủy miễn phí, bạn cần phải hủy trước ngày quy định trong đơn đặt phòng. Sau thời gian này, bạn sẽ bị tính
            phí hủy phòng. Đối với gói đặt tháng thì bạn không thể hủy vì khoản tiền quá lớn, bạn có thể liên hệ với hệ
            thống để nhận hỗ trợ dời phòng.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel2a-content' id='panel2a-header'>
          <Typography fontWeight='bold'>Phí hủy phòng là bao nhiêu nếu hủy sau thời gian miễn phí?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Phí hủy phòng sẽ được tính dựa trên phần trăm giá trị đơn đặt phòng và sẽ được thông báo rõ trong điều
            khoản.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel3a-content' id='panel3a-header'>
          <Typography fontWeight='bold'>Làm thế nào để liên hệ hỗ trợ nếu cần?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Bạn có thể sử dụng nút "Tin nhắn mới" bên dưới để liên hệ hệ thống hỗ trợ hoặc gọi đến số hotline để được
            giải đáp thắc mắc.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel4a-content' id='panel4a-header'>
          <Typography fontWeight='bold'>Sau khi hủy phòng, tôi có thể đặt lại cùng phòng đó không?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Sau khi hủy, phòng sẽ trở lại trạng thái có sẵn. Bạn có thể đặt lại phòng nếu phòng đó chưa được người khác
            đặt.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel5a-content' id='panel5a-header'>
          <Typography fontWeight='bold'>Tôi có thể thay đổi ngày đặt phòng mà không hủy không?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Có thể! Bạn vui lòng liên hệ bộ phận hỗ trợ hoặc xem mục “Quản lý đặt phòng” để thực hiện thay đổi mà không
            cần hủy. Việc thay đổi tùy thuộc vào tình trạng trống của phòng.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel6a-content' id='panel6a-header'>
          <Typography fontWeight='bold'>Khi nào tôi sẽ nhận được hoàn tiền sau khi hủy?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Sau khi hủy phòng thành công, số tiền sẽ được hoàn lại trong vòng 5-7 ngày làm việc, tùy thuộc vào phương
            thức thanh toán mà bạn đã chọn.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

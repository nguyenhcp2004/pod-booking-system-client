import React from 'react'
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, Divider, useTheme } from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel'

export default function TermsAndConditions() {
  const theme = useTheme()

  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ my: 4, p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <GavelIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
          <Typography
            variant='h3'
            component='h1'
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            Điều khoản và Điều kiện
          </Typography>
        </Box>
        <Typography variant='body1' paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 3 }}>
          Chào mừng bạn đến với dịch vụ đặt POD của chúng tôi. Bằng cách sử dụng dịch vụ này, bạn đồng ý với các điều
          khoản và điều kiện sau:
        </Typography>
        <List sx={{ bgcolor: theme.palette.background.default, borderRadius: 2, p: 2, mb: 4 }}>
          {[
            {
              primary: '1. Sử dụng Dịch vụ',
              secondary:
                'Bạn đồng ý sử dụng dịch vụ của chúng tôi chỉ cho các mục đích hợp pháp và theo đúng các điều khoản này.'
            },
            {
              primary: '2. Đặt POD',
              secondary:
                'Khi đặt POD, bạn cam kết cung cấp thông tin chính xác và đầy đủ. Chúng tôi có quyền từ chối hoặc hủy bỏ đơn đặt nếu phát hiện thông tin không chính xác.'
            },
            {
              primary: '3. Thanh toán',
              secondary:
                'Bạn đồng ý thanh toán đầy đủ cho các dịch vụ bạn sử dụng theo giá và phương thức được hiển thị tại thời điểm đặt.'
            },
            {
              primary: '4. Hủy đặt',
              secondary: 'Chính sách hủy đặt sẽ được áp dụng theo quy định cụ thể cho từng loại POD và thời gian đặt.'
            },
            {
              primary: '5. Trách nhiệm của người dùng',
              secondary:
                'Bạn chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của mình và đồng ý không sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào.'
            },
            {
              primary: '6. Thay đổi điều khoản',
              secondary:
                'Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là bạn đã chấp nhận các điều khoản mới.'
            }
          ].map((item, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems='flex-start' sx={{ flexDirection: 'column' }}>
                <ListItemText
                  primary={
                    <Typography variant='h6' color='primary' gutterBottom>
                      {item.primary}
                    </Typography>
                  }
                  secondary={<Typography variant='body2'>{item.secondary}</Typography>}
                />
              </ListItem>
              {index < 5 && <Divider variant='middle' component='li' />}
            </React.Fragment>
          ))}
        </List>
        <Typography
          variant='body1'
          paragraph
          sx={{ fontSize: '1.1rem', fontWeight: 'medium', textAlign: 'center', mt: 4 }}
        >
          Bằng cách sử dụng dịch vụ của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với tất cả các điều
          khoản và điều kiện này.
        </Typography>
      </Paper>
    </Container>
  )
}

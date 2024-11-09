import React from 'react'
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, Divider, useTheme } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'

export default function PrivacyPolicy() {
  const theme = useTheme()

  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ my: 4, p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <LockIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
          <Typography
            variant='h3'
            component='h1'
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            Thông báo về Bảo mật
          </Typography>
        </Box>
        <Typography variant='body1' paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Chúng tôi coi trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân của bạn. Thông báo về bảo mật
          này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn:
        </Typography>
        <List sx={{ bgcolor: theme.palette.background.default, borderRadius: 2, p: 2, mb: 4 }}>
          {[
            {
              primary: '1. Thu thập thông tin',
              secondary:
                'Chúng tôi thu thập thông tin cá nhân như tên, địa chỉ email, số điện thoại khi bạn đăng ký tài khoản hoặc đặt POD.'
            },
            {
              primary: '2. Sử dụng thông tin',
              secondary:
                'Thông tin của bạn được sử dụng để xử lý đơn đặt, cung cấp dịch vụ khách hàng, và cải thiện trải nghiệm sử dụng của bạn.'
            },
            {
              primary: '3. Bảo mật thông tin',
              secondary:
                'Chúng tôi áp dụng các biện pháp bảo mật thích hợp để bảo vệ thông tin của bạn khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy.'
            },
            {
              primary: '4. Chia sẻ thông tin',
              secondary:
                'Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, trừ khi được yêu cầu bởi pháp luật hoặc với sự đồng ý của bạn.'
            },
            {
              primary: '5. Cookie và công nghệ theo dõi',
              secondary:
                'Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn trên trang web của chúng tôi.'
            },
            {
              primary: '6. Quyền của bạn',
              secondary:
                'Bạn có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình. Vui lòng liên hệ với chúng tôi nếu bạn muốn thực hiện các quyền này.'
            },
            {
              primary: '7. Thay đổi chính sách',
              secondary:
                'Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào.'
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
              {index < 6 && <Divider variant='middle' component='li' />}
            </React.Fragment>
          ))}
        </List>
        <Typography variant='body1' paragraph sx={{ fontSize: '1.1rem', fontWeight: 'medium', textAlign: 'center' }}>
          Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi, vui lòng liên hệ với chúng tôi qua email:
        </Typography>
        <Typography variant='h6' sx={{ color: theme.palette.primary.main, textAlign: 'center' }}>
          privacy@flexipod.com
        </Typography>
      </Paper>
    </Container>
  )
}

import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material'

export default function PrivacyPolicy() {
  return (
    <Container maxWidth='md'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h3' component='h1' gutterBottom>
          Thông báo về Bảo mật
        </Typography>
        <Typography variant='body1' paragraph>
          Chúng tôi coi trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân của bạn. Thông báo về bảo mật
          này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn:
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary='1. Thu thập thông tin'
              secondary='Chúng tôi thu thập thông tin cá nhân như tên, địa chỉ email, số điện thoại khi bạn đăng ký tài khoản hoặc đặt POD.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='2. Sử dụng thông tin'
              secondary='Thông tin của bạn được sử dụng để xử lý đơn đặt, cung cấp dịch vụ khách hàng, và cải thiện trải nghiệm sử dụng của bạn.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='3. Bảo mật thông tin'
              secondary='Chúng tôi áp dụng các biện pháp bảo mật thích hợp để bảo vệ thông tin của bạn khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='4. Chia sẻ thông tin'
              secondary='Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, trừ khi được yêu cầu bởi pháp luật hoặc với sự đồng ý của bạn.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='5. Cookie và công nghệ theo dõi'
              secondary='Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn trên trang web của chúng tôi.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='6. Quyền của bạn'
              secondary='Bạn có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình. Vui lòng liên hệ với chúng tôi nếu bạn muốn thực hiện các quyền này.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='7. Thay đổi chính sách'
              secondary='Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào.'
            />
          </ListItem>
        </List>
        <Typography variant='body1' paragraph>
          Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi, vui lòng liên hệ với chúng tôi qua email:
          privacy@flexipod.com
        </Typography>
      </Box>
    </Container>
  )
}

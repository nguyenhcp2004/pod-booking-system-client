import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material'

export default function TermsAndConditions() {
  return (
    <Container maxWidth='md'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h3' component='h1' gutterBottom>
          Điều khoản và Điều kiện
        </Typography>
        <Typography variant='body1' paragraph>
          Chào mừng bạn đến với dịch vụ đặt POD của chúng tôi. Bằng cách sử dụng dịch vụ này, bạn đồng ý với các điều
          khoản và điều kiện sau:
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary='1. Sử dụng Dịch vụ'
              secondary='Bạn đồng ý sử dụng dịch vụ của chúng tôi chỉ cho các mục đích hợp pháp và theo đúng các điều khoản này.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='2. Đặt POD'
              secondary='Khi đặt POD, bạn cam kết cung cấp thông tin chính xác và đầy đủ. Chúng tôi có quyền từ chối hoặc hủy bỏ đơn đặt nếu phát hiện thông tin không chính xác.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='3. Thanh toán'
              secondary='Bạn đồng ý thanh toán đầy đủ cho các dịch vụ bạn sử dụng theo giá và phương thức được hiển thị tại thời điểm đặt.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='4. Hủy đặt'
              secondary='Chính sách hủy đặt sẽ được áp dụng theo quy định cụ thể cho từng loại POD và thời gian đặt.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='5. Trách nhiệm của người dùng'
              secondary='Bạn chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của mình và đồng ý không sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào.'
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary='6. Thay đổi điều khoản'
              secondary='Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là bạn đã chấp nhận các điều khoản mới.'
            />
          </ListItem>
        </List>
        <Typography variant='body1' paragraph>
          Bằng cách sử dụng dịch vụ của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với tất cả các điều
          khoản và điều kiện này.
        </Typography>
      </Box>
    </Container>
  )
}

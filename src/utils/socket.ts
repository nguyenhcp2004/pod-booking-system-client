import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const socket = new SockJS('http://localhost:8080/ws')
const client = Stomp.over(socket)
export default client

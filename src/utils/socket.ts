import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import envConfig from '~/constants/config'

const socket = new SockJS(envConfig.VITE_SOCKET_URL)
const client = Stomp.over(socket)
export default client

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import envConfig from '~/constants/config'

const firebaseConfig = {
  apiKey: envConfig.VITE_API_KEY,
  authDomain: envConfig.VITE_AUTH_DOMAIN,
  projectId: envConfig.VITE_PROJECT_ID,
  storageBucket: envConfig.VITE_STORAGE_BUCKET,
  messagingSenderId: envConfig.VITE_MESSAGING_SENDER_ID,
  appId: envConfig.VITE_APP_ID,
  measurementId: envConfig.VITE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export { auth, provider }

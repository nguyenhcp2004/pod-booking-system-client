import { createContext, SetStateAction, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountType } from '~/schemaValidations/auth.schema'
import { getAccessTokenFromLS, getAccountFromLS, getRefreshTokenFromLS } from '~/utils/auth'

interface AppContextInterface {
  isAuth: boolean
  setAuth: React.Dispatch<SetStateAction<boolean>>
  account: AccountType | null
  setAccount: React.Dispatch<SetStateAction<AccountType | null>>
  reset: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuth: Boolean(getAccessTokenFromLS()),
  setAuth: () => null,
  account: getAccountFromLS(),
  setAccount: () => null,
  reset: () => null
})

const initialAppContext = getInitialAppContext()

export const AppContext = createContext<AppContextInterface>(initialAppContext)

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({
  children,
  defaultValue = initialAppContext
}: {
  children: React.ReactNode
  defaultValue?: AppContextInterface
}) {
  const [isAuth, setAuth] = useState<boolean>(defaultValue.isAuth)
  const [account, setAccount] = useState<AccountType | null>(defaultValue.account)
  const navigate = useNavigate()
  const reset = () => {
    setAuth(false)
    setAccount(null)
  }

  useEffect(() => {
    const handleStorageChange = () => {
      if (!getRefreshTokenFromLS()) {
        setAccount(null)
        setAuth(false)
        navigate('/')
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [setAuth, setAccount, navigate])

  return <AppContext.Provider value={{ isAuth, setAuth, account, setAccount, reset }}>{children}</AppContext.Provider>
}

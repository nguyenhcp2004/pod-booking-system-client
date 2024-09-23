import { createContext, SetStateAction, useContext, useState } from 'react'
import { getAccessTokenFromLS } from '~/utils/auth'

interface AppContextInterface {
  isAuth: boolean
  setAuth: React.Dispatch<SetStateAction<boolean>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuth: Boolean(getAccessTokenFromLS()),
  setAuth: () => null
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

  return <AppContext.Provider value={{ isAuth, setAuth }}>{children}</AppContext.Provider>
}

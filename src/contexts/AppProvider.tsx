import { createContext, SetStateAction, useContext, useState } from 'react'
import { AccountType } from '~/schemaValidations/auth.schema'
import { getAccessTokenFromLS, getAccountFromLS } from '~/utils/auth'

interface AppContextInterface {
  isAuth: boolean
  setAuth: React.Dispatch<SetStateAction<boolean>>
  account: AccountType | null
  setAccount: React.Dispatch<SetStateAction<AccountType | null>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuth: Boolean(getAccessTokenFromLS()),
  setAuth: () => null,
  account: getAccountFromLS(),
  setAccount: () => null
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

  return <AppContext.Provider value={{ isAuth, setAuth, account, setAccount }}>{children}</AppContext.Provider>
}

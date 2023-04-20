import React from "react";

export const ReloadContext = React.createContext({
  setReload: (reload: {}) => {},
  reload: {},
})

type ReloadProviderProps = {
  children: React.ReactNode
}

const ReloadProvider = ({children}: ReloadProviderProps) => {
  const [reload, setReload] = React.useState({})
  
  return (
    <ReloadContext.Provider value={{ setReload, reload }}>
      {children}
    </ReloadContext.Provider>
  )
}

export default ReloadProvider;
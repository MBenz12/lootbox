import React from "react";
import Modal from "../components/Modal";

export const ModalContext = React.createContext({
  showModal: (element: React.ReactNode) => {}
})

type ModalProviderProps = {
  children: React.ReactNode
}

const ModalProvider = ({children}: ModalProviderProps) => {
  const [show, setShow] = React.useState(false)
  const [element, setElement] = React.useState<React.ReactNode>(null)

  const handleClose = () => {
    setShow(false)
  }
  const showModal = (element: React.ReactNode) => {
    setShow(true)
    setElement(element)
  }

  return (
    <ModalContext.Provider value={{showModal}}>
      <Modal show={show} handleClose={handleClose}>
        {element}
      </Modal>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider;
import React from "react";
import {motion, AnimatePresence} from "framer-motion";

interface ModalProps {
  children?: React.ReactNode;
  show: boolean;
  handleClose: () => void;
}

const Modal: React.FC<ModalProps> = ({children, show, handleClose}) => {
  return (
    <AnimatePresence>
      {
        show && (
          <motion.div
            initial={{backgroundColor: "rgba(0,0,0,0)"}}
            animate={{backgroundColor: "rgba(0,0,0,.75)"}}
            transition={{duration: 0.25}}
            exit={{backgroundColor: "rgba(0,0,0,0)"}}
            className={"fixed flex justify-center place-items-center top-0 left-0 bottom-0 w-full h-full z-10 bg-[rgba(0,0,0,0.8)]"}
            onClick={handleClose}>
            <motion.div
              initial={{y: -20, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{duration: 0.15}}
              exit={{y: -20, opacity: 0}}
              className={"z-20"}
              onClick={(e) => e.stopPropagation()}>
              {children}
            </motion.div>
          </motion.div>
        )
      }
    </AnimatePresence>
  );
};

export default Modal;
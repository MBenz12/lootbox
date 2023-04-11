import React from "react";
import {Navbar} from "@/components/Navbar";
import {motion, AnimatePresence} from "framer-motion";
import Link from "next/link";

const MobileMenu = ({show}: {show: boolean}) => {
  return (
    <div className="lg:hidden">
      <AnimatePresence>
        {
          show && (
            <motion.div
              initial={{x: "-100%"}}
              animate={{x: 0}}
              exit={{x: "-100%"}}
              transition={{duration: 0.3}}
              className="fixed top-0 left-0 right-0 py-10 px-5 w-2/3 h-full bg-[#0b0c1a] z-20">
              <motion.div
                initial={{x: -50, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.4, delay: 0.20}}
                className="flex h-full w-full flex-col place-items-end gap-10"
              >
                <Navbar/>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  )
}

export const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  return (
    <header className='flex justify-center'>
      <div className="flex w-full container place-items-center h-[100px] bg-[rgba(18,_18,_19,_0.6)]">
        <Link href={"/"} className="bg-gray-600 px-10 py-2 rounded-[15px]">
          <p>Logo</p>
        </Link>
        <nav className="w-full">
          <div className="hidden place-items-center justify-between gap-10 lg:flex">
            <Navbar/>
          </div>
          <div className="flex w-full justify-end lg:hidden">
            <div className="cursor-pointer space-y-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <span className="block w-8 bg-gray-600 h-0.5"></span>
              <span className="block w-6 bg-gray-600 h-0.5"></span>
              <span className="block w-4 bg-gray-600 h-0.5"></span>
            </div>
          </div>
        </nav>
        <MobileMenu show={showMobileMenu} />
      </div>
    </header>
  )
}
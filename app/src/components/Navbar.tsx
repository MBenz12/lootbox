import React from 'react';
import { motion } from "framer-motion"
import {useRouter} from "next/router";
import Link from 'next/link';
import Image from 'next/image';

const NavbarAnchor = ({active}: {active: boolean}) => {
  return (
    <motion.div
      className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-underline"
      initial={{ width: 0 }}
      animate={{ width: active ? "100%" : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}

export const Navbar: React.FC = () => {
  const location = useRouter();
  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <>
      <div className="flex flex-col gap-10 md:flex-row md:px-10">
        <Link href={"/"} className={`relative transition-opacity ${!isCurrentPath("/") && "opacity-50"} duration-300 text-center`}>
          LOOTBOXES
          <NavbarAnchor active={isCurrentPath("/")} />
        </Link>
        <Link href={"/claim"} className={`relative transition-opacity ${!isCurrentPath("/claim") && "opacity-50"} duration-300 text-center`}>
          CLAIM
          <NavbarAnchor active={isCurrentPath("/claim")} />
        </Link>
      </div>
      <div className="flex flex-col gap-20 md:flex-row">
        <div className="flex justify-end gap-3">
          <div className="flex flex-col justify-center text-right">
            <p className="opacity-50 text-[13px]">BALANCE</p>
            <p className="text-[17px]">75O ZEN</p>
          </div>
          <Image width={46} height={46} src="/images/coin.png" alt=""/>
        </div>
        <div className="flex justify-end gap-3">
          <div className="flex flex-col justify-center text-right">
            <p className="opacity-50 text-[13px]">1234...4321</p>
            <p className="text-[17px]">Pablo</p>
          </div>
          <Image width={46} height={46} src="/images/avatar.png" alt=""/>
        </div>
      </div>
    </>
  );
};
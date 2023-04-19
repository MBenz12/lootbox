/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";

const Box = ({ boxImage }: { boxImage: string }) => {

  const boxImageVariants = {
    initial: {
      y: "-200%"
    },
    animate: {
      y: 0
    }
  };

  return (
    <div className={"relative z-10 flex justify-center place-items-center mt-30 h-[371px]"}>
      <motion.img
        variants={boxImageVariants}
        initial="initial"
        animate="animate"
        transition={{
          delay: 0.5,
          stiffness: 60,
          mass: 1,
          damping: 7,
          type: "spring"
        }}
        src={boxImage}
        alt="opened_lootbox"
        draggable={false} />
    </div>
  );
};

export default Box;
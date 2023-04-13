/* eslint-disable @next/next/no-img-element */
import { OpenedPrize } from "@/types";
import { motion } from "framer-motion";

const Box = ({ boxImage, showPrize, prize }: { boxImage: string, showPrize: boolean, prize?: OpenedPrize }) => {
  const getRarityColor = () => {
    return [
      "rgba(52,55,81,0.5)",
      "rgba(70,147,218,0.5)",
      "rgba(237,154,31,0.5)",
      "rgba(255,124,250,0.5)"
    ][prize?.rarity || 0];
  };

  const boxImageVariants = {
    initial: {
      y: "-200%"
    },
    animate: {
      y: 0
    }
  };

  const prizeVariants = {
    initial: {
      y: "3%",
      opacity: 0
    },
    animate: {
      y: "-90%",
      scale: [
        0.6,
        1
      ],
      rotate: 360,
      boxShadow: `0px 0px 20px 35px ${getRarityColor()}`,
      opacity: 1
    }
  };

  return (
    <div className={"relative z-10 flex justify-center place-items-center mt-10"}>
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
      {
        showPrize && prize && (
          <motion.div
            variants={prizeVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1,
              type: "spring",
              boxShadow: {
                delay: 1.2,
                duration: .5,
              },
              scale: {
                duration: 1,
                delay: 1.2,
                type: "spring",
                stiffness: 30,
                mass: 1,
                damping: 3
              },
              rotate: {
                duration: 1,
                type: "spring",
                stiffness: 50,
                mass: 1,
                damping: 10
              }
            }}
            className={"absolute rounded-xl w-[45%] aspect-square bg-cover bg-no-repeat bg-center"}
            style={{
              backgroundImage: `url(${prize.image})`,
            }}
          >
          </motion.div>
        )
      }
    </div>
  );
};

export default Box;
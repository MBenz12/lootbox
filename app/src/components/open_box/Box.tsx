import { motion } from "framer-motion";

type Prize = {
  image: string;
  rarity: number;
}

const Box = ({ boxImage, showPrize, prize }: { boxImage: string, showPrize: boolean, prize?: Prize }) => {
  const getRarityColor = () => {
    return [
      "rgba(52,55,81,0.5)",
      "rgba(70,147,218,0.5)",
      "rgba(237,154,31,0.5)",
      "rgba(255,124,250,0.5)"
    ][prize?.rarity || 0]
  }

  return (
    <motion.div
      initial={{
        y: "-200%"
      }}
      animate={{
        y: 0
      }}
      transition={{
        delay: 0.5,
        stiffness: 60,
        mass: 1,
        damping: 7,
        type: "spring"
      }}
      className={"absolute mt-[10%] lg:mt-[8%] flex place-items-center justify-center top-0 left-0 place-self-center h-2/3 w-full"}
    >
      <img className={"w-[30%] lg:w-[25%]"} src={boxImage} alt="opened_lootbox" draggable={false} />
      {
        showPrize && prize && (
          <motion.div
            initial={{
              y: "3%",
              opacity: 0
            }}
            animate={{
              y: "-80%",
              scale: [
                0.6,
                1
              ],
              rotate: 360,
              boxShadow: [
                `0px 0px 40px 40px ${getRarityColor()}`,
                `0px 0px 50px 40px ${getRarityColor()}`,
                `0px 0px 40px 40px ${getRarityColor()}`
              ],
              opacity: 1,
            }}
            transition={{
              duration: 1,
              type: "spring",
              boxShadow: {
                duration: 1.5,
                repeat: Infinity,
                yoyo: true,
                yoyoTransition: "linear",
                ease: "linear"
              },
              scale: {
                duration: 1,
                delay: 1.2,
                type: "spring",
                stiffness: 30,
                mass: 1,
                damping: 3,
              },
              rotate: {
                duration: 1,
                type: "spring",
                stiffness: 50,
                mass: 1,
                damping: 10,
              }
            }}
            className={"absolute rounded-xl w-[18%] aspect-square lg:w-[13%]"}
            style={{
              background: `url(${prize.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
          </motion.div>
        )
      }
    </motion.div>
  );
};

export default Box;
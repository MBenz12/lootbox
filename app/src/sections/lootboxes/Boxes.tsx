import React from 'react';
import BoxItem from "../../components/lootboxes/BoxItem";
import {ModalContext} from "@/contexts/modal-context";

export const Boxes = () => {
  const boxes = [
    {
      name: "ZEN",
      nameColor: "#E93E67",
      description: "Use ZEN for a chance to win NFTs, SOL, merch and more.",
      price: 500
    },
    {
      name: "Free",
      nameColor: "#2A6ED4",
      description: "Try a free spin by having staked Ukiyans in your wallet.",
      price: 0
    }
  ]

  const {showModal} = React.useContext(ModalContext)
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))] place-items-center gap-5 gap-y-20 my-20">
      {
        boxes.map((box, index) => (
          <BoxItem key={index} handleClick={() => {
            alert(`Handle opening ${box.name} box`)
            showModal(
              <BoxItem name={box.name} nameColor={box.nameColor} description={box.description} price={box.price} opening/>
            )
          }} name={box.name} nameColor={box.nameColor} description={box.description} price={box.price}/>
        ))
      }
    </div>
  );
};
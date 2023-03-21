import { Banner } from '@/sections/lootboxes/Banner'
import { Boxes } from '@/sections/lootboxes/Boxes'
import { Prizes } from '@/sections/lootboxes/Prizes'
import Head from 'next/head'
import LiveFeed from "@/components/LiveFeed";
import React from "react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Lootbox</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-5 lg:px-32">
        <Banner/>
        <Prizes/>
        <Boxes/>
        <LiveFeed />
      </div>
    </>
  )
}

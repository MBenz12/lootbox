// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Event } from '@/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { signature, lootboxName, user, rarity, timestamp, image, name, symbol, amount, mint } = req.body;
  const events: Array<Event> = require('../../../../playEvents.json');
  if (events.map((event) => event.signature).includes(signature)) {
    return res.json("success");
  }
  events.push({
    signature,
    lootboxName,
    user,
    rarity,
    timestamp,
    image,
    name,
    symbol,
    amount,
    mint,
  });
  writeFileSync('../playEvents.json', JSON.stringify(events, null, '\t'));
  res.status(200).json("success");
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import PlayEvent from '@/db/models/PlayEvent';
import connect from '@/db/connect';
import Box from '@/db/models/Box';

const getBox = (boxes: Array<any>, id: string) => {
  let index = boxes.map(box => box.id).indexOf(id);
  if (index !== -1) {
    return boxes[index];
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<any>>
) {
  await connect();
  const events = await PlayEvent.find();
  const boxes = await Box.find();
  events.reverse();
  events.forEach(event => {
    let box = getBox(boxes, event.lootboxName);
    if (box) {
      event.lootboxName = box.name;
    }
  })
  res.status(200).json(events.slice(0, 10));
}

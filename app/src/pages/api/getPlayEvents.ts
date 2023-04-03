// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<any>>
) {
  const liveFeed = require('../../../../playEvents.json');
  const events = [...liveFeed];
  events.reverse();
  res.status(200).json(events.slice(0, 10));
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<any>>
) {
  const liveFeed = require('../../../../playEvents.json');
  liveFeed.reverse();
  res.status(200).json(liveFeed.slice(0, 10));
}

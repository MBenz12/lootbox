// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {
  const { url } = req.body;
  const prizes = require('../../../../prizes.json');
  res.status(200).json(prizes);
}

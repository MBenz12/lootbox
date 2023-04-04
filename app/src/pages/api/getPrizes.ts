// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Prize from '@/db/models/Prize';
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {
  await connect();
  const prizes = await Prize.find();
  res.status(200).json(prizes.map(prize => prize.url));
}

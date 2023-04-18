// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Prize from '@/db/models/Prize';
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { itemIndex } = req.body;
  const prizes = await Prize.find();
  await connect();
  await Prize.findOneAndUpdate(prizes[itemIndex], { isDeleted: true });
  res.status(200).json("success");
}

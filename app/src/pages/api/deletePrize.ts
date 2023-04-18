// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Prize from '@/db/models/Prize';
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { itemIndex } = req.body;
  await connect();
  const prizes = await Prize.find();
  const prize = await Prize.findOne({url: prizes[itemIndex].url});
  prize.isDeleted = true;
  await prize.save();
  console.log(prize);
  res.status(200).json("success");
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Prize from '@/db/models/Prize';
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { url } = req.body;
  await connect();
  await Prize.create({ url });
  res.status(200).json("success");
}

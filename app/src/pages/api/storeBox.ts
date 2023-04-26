// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Box from '@/db/models/Box';
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { id, name, description, image } = req.body;
  await connect();
  const box = await Box.find({ id });
  if (box.length) {
    await Box.updateOne({ id }, { name, description, image })
  } else {
    await Box.create({ id, name, description, image });
  }
  res.status(200).json("success");
}

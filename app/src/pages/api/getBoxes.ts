// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Box from '@/db/models/Box';
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<any>>
) {
  await connect();
  const boxes = await Box.find();
  res.status(200).json(boxes);
}

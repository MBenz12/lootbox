// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Claim from '@/db/models/Claim';
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<any>>
) {
  await connect();
  const { user } = req.body;
  const claims = await Claim.find({ user });
  res.status(200).json(claims);
}

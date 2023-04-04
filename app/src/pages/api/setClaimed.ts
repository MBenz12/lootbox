// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Claim from '@/db/models/Claim';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  await connect();
  const { claimId } = req.body;
  await Claim.deleteOne({ _id: new ObjectId(claimId) });
  res.status(200).json("success");
}

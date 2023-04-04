// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Claim from '@/db/models/Claim';
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  await connect();
  const { claimIndex } = req.body;
  const claims = await Claim.find();
  const claim = claims[claimIndex];
  if (claim) {
    await Claim.deleteOne(claim);
  }
  res.status(200).json("success");
}

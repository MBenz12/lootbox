// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Claim } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Claim>>
) {
  const { user } = req.body;
  const claims: Array<Claim> = require('../../../../claims.json');
  res.status(200).json(
    claims.filter((claim) => {
      return claim.user === user
    })
  );
}

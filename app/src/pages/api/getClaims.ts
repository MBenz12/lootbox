// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Claim } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Claim>>
) {
  const claims = require('../../../../claims.json');
  res.status(200).json(claims);
}

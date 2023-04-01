// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Claim } from '@/types';
import { writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { claimIndex } = req.body;
  const claims = require('../../../../claims.json');
  claims.splice(claimIndex, 1);
  writeFileSync('../claims.json', JSON.stringify(claims, null, '\t'));
  res.status(200).json("success");
}

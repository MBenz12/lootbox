// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { url } = req.body;
  const prizes = await require('../../../../prizes.json');
  prizes.push(url);
  writeFileSync('../prizes.json', JSON.stringify(prizes, null, '\t'));
  res.status(200).json("success");
}

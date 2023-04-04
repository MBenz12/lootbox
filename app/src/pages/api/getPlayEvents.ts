// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import PlayEvent from '@/db/models/PlayEvent';
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<any>>
) {
  await connect();
  const events = await PlayEvent.find();
  events.reverse();
  res.status(200).json(events.slice(0, 10));
}

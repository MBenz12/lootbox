// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import Claim from '@/db/models/Claim';
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { access_token, user, lootboxName, prizeIndex, itemIndex } = req.body;

  try {
    const { data: { id, username, discriminator } } = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    await connect();
    const claim = await Claim.findOne({ user, lootboxName, prizeIndex, itemIndex });
    if (!claim) {
      await Claim.create({
        user,
        username: username + "#" + discriminator,
        discordId: id,
        lootboxName,
        prizeIndex,
        itemIndex,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }

  res.json("success");
}

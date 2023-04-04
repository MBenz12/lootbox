// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import DiscordOauth2 from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DOMAIN } from '@/config';
import axios from 'axios';
import Claim from '@/db/models/Claim';
import connect from '@/db/connect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code === undefined ? "" : req.query.code.toString();
  const {
    user,
    lootboxName,
    prizeIndex,
    itemIndex,
  } = JSON.parse(req.query.state === undefined ? "" : req.query.state.toString());

  const oauth = new DiscordOauth2();
  try {
    const { access_token } = await oauth.tokenRequest({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      code: code,
      scope: "identify",
      grantType: "authorization_code",
      redirectUri: `${DOMAIN}/api/discord/callback`,
    });
    console.log(access_token);
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
  }
  res.redirect(`${DOMAIN}/claim`);
}

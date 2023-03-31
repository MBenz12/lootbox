// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import DiscordOauth2 from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DOMAIN } from '@/config';
import axios from 'axios';
import { writeFileSync } from 'fs';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
      redirectUri: `http://localhost:3000/api/discord/callback`,
    });
    console.log(access_token);
    const { data: { id, username, discriminator } } = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    const claims = require('../../../../../claims.json');
    claims.push({
      user,
      username: username + "#" + discriminator,
      discordId: id,
      lootboxName,
      prizeIndex,
      itemIndex,
    })
    writeFileSync('../claims.json', JSON.stringify(claims, null, '\t'));
  } catch (error) {
    console.log(error);
  }
  res.redirect(`${DOMAIN}/claim`);
}

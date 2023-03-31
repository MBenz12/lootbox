// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import DiscordOauth2 from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DOMAIN } from '@/config';
import axios from 'axios';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const code = req.query.code === undefined ? "" : req.query.code.toString();
  const itemIndex = parseInt(req.query.state === undefined ? "" : req.query.state.toString());

  // const oauth = new DiscordOauth2();
  // const { access_token } = await oauth.tokenRequest({
  //   clientId: CLIENT_ID,
  //   clientSecret: CLIENT_SECRET,
  //   code: code,
  //   scope: "identify",
  //   grantType: "authorization_code",
  //   redirectUri: `${DOMAIN}/api/discord/callback`,
  // });

  // const { data: { id } } = await axios.get("https://discord.com/api/users/@me", {
  //   headers: {
  //     Authorization: `Bearer ${access_token}`,
  //   },
  // });

  res.redirect(`${DOMAIN}?itemIndex=${itemIndex}&userId=${CLIENT_ID}`);
}

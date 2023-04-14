// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import DiscordOauth2 from "discord-oauth2";
import { CLIENT_ID, CLIENT_SECRET, DOMAIN } from '@/config';
import { serialize } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code === undefined ? "" : req.query.code.toString();
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
    const cookie = serialize("discord_access", access_token, {
      httpOnly: true,
      path: "/",
    });
    res.setHeader("Set-Cookie", cookie);
  } catch (error) {
    console.log(error);
  }
  res.redirect(`${DOMAIN}/claim`);
}

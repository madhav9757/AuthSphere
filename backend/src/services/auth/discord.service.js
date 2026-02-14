import axios from "axios";
import { conf } from "../../configs/env.js";

export function getDiscordAuthURL(context = { type: "dev" }) {
  let state = "dev";
  if (context.type === "sdk" && context.sdk_request) {
    state = `sdk:${context.sdk_request}`;
  }
  if (context.type === "cli") state = "cli";

  const params = new URLSearchParams({
    client_id: conf.DISCORD_CLIENT_ID,
    redirect_uri: conf.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
    prompt: "consent",
    state,
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function getDiscordUser(code) {
  const tokenRes = await axios.post(
    "https://discord.com/api/oauth2/token",
    new URLSearchParams({
      client_id: conf.DISCORD_CLIENT_ID,
      client_secret: conf.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: conf.DISCORD_REDIRECT_URI,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { access_token } = tokenRes.data;

  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return {
    id: userRes.data.id,
    username: userRes.data.username,
    email: userRes.data.email,
    avatar: userRes.data.avatar
      ? `https://cdn.discordapp.com/avatars/${userRes.data.id}/${userRes.data.avatar}.png`
      : null,
  };
}

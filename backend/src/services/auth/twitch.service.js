import axios from "axios";
import { conf } from "../../configs/env.js";

/**
 * Returns Twitch OAuth 2.0 authorization URL
 */
export function getTwitchAuthURL(context = { type: "dev" }) {
    let state = "dev";
    if (context.type === "sdk" && context.sdk_request) state = `sdk:${context.sdk_request}`;
    if (context.type === "cli") state = "cli";

    const params = new URLSearchParams({
        client_id: conf.TWITCH_CLIENT_ID,
        redirect_uri: conf.TWITCH_REDIRECT_URI,
        response_type: "code",
        scope: "user:read:email openid",
        state,
    });

    return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getTwitchUser(code) {
    const tokenRes = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        new URLSearchParams({
            client_id: conf.TWITCH_CLIENT_ID,
            client_secret: conf.TWITCH_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: conf.TWITCH_REDIRECT_URI,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // Twitch userinfo requires Client-Id header too
    const userRes = await axios.get("https://api.twitch.tv/helix/users", {
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Client-Id": conf.TWITCH_CLIENT_ID,
        },
    });

    const userData = userRes.data.data[0];

    return {
        sub: userData.id,
        email: userData.email,
        name: userData.display_name,
        picture: userData.profile_image_url,
        username: userData.login,
    };
}

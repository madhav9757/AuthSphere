import axios from "axios";
import { conf } from "../configs/env.js";

/**
 * Returns Bitbucket OAuth 2.0 authorization URL
 */
export function getBitbucketAuthURL(context = { type: "dev" }) {
    let state = "dev";
    if (context.type === "sdk" && context.sdk_request) state = `sdk:${context.sdk_request}`;
    if (context.type === "cli") state = "cli";

    const params = new URLSearchParams({
        client_id: conf.BITBUCKET_CLIENT_ID,
        redirect_uri: conf.BITBUCKET_REDIRECT_URI,
        response_type: "code",
        state,
    });

    return `https://bitbucket.org/site/oauth2/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getBitbucketUser(code) {
    const auth = Buffer.from(`${conf.BITBUCKET_CLIENT_ID}:${conf.BITBUCKET_CLIENT_SECRET}`).toString("base64");

    const tokenRes = await axios.post(
        "https://bitbucket.org/site/oauth2/access_token",
        new URLSearchParams({
            grant_type: "authorization_code",
            code,
        }),
        {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    const { access_token } = tokenRes.data;

    // Fetch basic user profile
    const userRes = await axios.get("https://api.bitbucket.org/2.0/user", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    // Fetch email separately (Bitbucket doesn't return it in /user by default)
    const emailRes = await axios.get("https://api.bitbucket.org/2.0/user/emails", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    const primaryEmail = emailRes.data.values.find(e => e.is_primary)?.email || emailRes.data.values[0]?.email;

    return {
        sub: userRes.data.uuid,
        email: primaryEmail,
        name: userRes.data.display_name,
        picture: userRes.data.links?.avatar?.href,
        username: userRes.data.username,
    };
}

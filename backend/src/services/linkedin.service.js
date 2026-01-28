import axios from "axios";
import { conf } from "../configs/env.js";

/**
 * Returns LinkedIn OAuth 2.0 authorization URL
 */
export function getLinkedinAuthURL(context = { type: "dev" }) {
    let state = "dev";
    if (context.type === "sdk" && context.sdk_request) state = `sdk:${context.sdk_request}`;
    if (context.type === "cli") state = "cli";

    const params = new URLSearchParams({
        client_id: conf.LINKEDIN_CLIENT_ID,
        redirect_uri: conf.LINKEDIN_REDIRECT_URI,
        response_type: "code",
        scope: "openid profile email", // Newer OpenID Connect scopes
        state,
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getLinkedinUser(code) {
    const tokenRes = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: conf.LINKEDIN_CLIENT_ID,
            client_secret: conf.LINKEDIN_CLIENT_SECRET,
            redirect_uri: conf.LINKEDIN_REDIRECT_URI,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // Fetch standardized OIDC userinfo
    const userRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    return {
        sub: userRes.data.sub,
        email: userRes.data.email,
        name: userRes.data.name,
        picture: userRes.data.picture,
        username: userRes.data.given_name || userRes.data.name.split(" ")[0],
    };
}

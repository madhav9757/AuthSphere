import axios from "axios";
import { conf } from "../../configs/env.js";

/**
 * Returns Microsoft (Azure AD) OAuth 2.0 authorization URL
 */
export function getMicrosoftAuthURL(context = { type: "dev" }) {
    let state = "dev";
    if (context.type === "sdk" && context.sdk_request) state = `sdk:${context.sdk_request}`;
    if (context.type === "cli") state = "cli";

    const params = new URLSearchParams({
        client_id: conf.MICROSOFT_CLIENT_ID,
        redirect_uri: conf.MICROSOFT_REDIRECT_URI,
        response_type: "code",
        scope: "openid profile email User.Read",
        response_mode: "query",
        state,
    });

    // Using 'common' endpoint to support both personal and work accounts
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getMicrosoftUser(code) {
    const tokenRes = await axios.post(
        "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        new URLSearchParams({
            client_id: conf.MICROSOFT_CLIENT_ID,
            client_secret: conf.MICROSOFT_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: conf.MICROSOFT_REDIRECT_URI,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // Fetch user data from Microsoft Graph
    const userRes = await axios.get("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    return {
        sub: userRes.data.id,
        email: userRes.data.mail || userRes.data.userPrincipalName,
        name: userRes.data.displayName,
        picture: null, // Microsoft Graph profile pictures require a separate binary stream request
        username: userRes.data.displayName.split(" ")[0].toLowerCase(),
    };
}

import axios from "axios";
import { conf } from "../configs/env.js";

/**
 * Returns GitLab OAuth 2.0 authorization URL
 */
export function getGitlabAuthURL(context = { type: "dev" }) {
    let state = "dev";
    if (context.type === "sdk" && context.sdk_request) state = `sdk:${context.sdk_request}`;
    if (context.type === "cli") state = "cli";

    const params = new URLSearchParams({
        client_id: conf.GITLAB_CLIENT_ID,
        redirect_uri: conf.GITLAB_REDIRECT_URI,
        response_type: "code",
        scope: "read_user openid email profile",
        state,
    });

    return `https://gitlab.com/oauth/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token and fetches user info
 */
export async function getGitlabUser(code) {
    const tokenRes = await axios.post(
        "https://gitlab.com/oauth/token",
        {
            client_id: conf.GITLAB_CLIENT_ID,
            client_secret: conf.GITLAB_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: conf.GITLAB_REDIRECT_URI,
        }
    );

    const { access_token } = tokenRes.data;

    const userRes = await axios.get("https://gitlab.com/api/v4/user", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    return {
        sub: String(userRes.data.id),
        email: userRes.data.email,
        name: userRes.data.name || userRes.data.username,
        picture: userRes.data.avatar_url,
        username: userRes.data.username,
    };
}

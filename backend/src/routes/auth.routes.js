// routes/auth.routes.js
import { Router } from "express";
import {
  googleLogin,
  googleCallback,
  githubLogin,
  githubCallback,
  discordLogin,
  discordCallback,
  linkedinLogin,
  linkedinCallback,
  gitlabLogin,
  gitlabCallback,
  twitchLogin,
  twitchCallback,
  bitbucketLogin,
  bitbucketCallback,
  microsoftLogin,
  microsoftCallback,
} from "../controllers/auth.controller.js";

const router = Router();

/* ---------------------- GOOGLE ---------------------- */
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

/* ---------------------- GITHUB ---------------------- */
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

/* ---------------------- DISCORD ---------------------- */
router.get("/discord", discordLogin);
router.get("/discord/callback", discordCallback);

/* ---------------------- LINKEDIN ---------------------- */
router.get("/linkedin", linkedinLogin);
router.get("/linkedin/callback", linkedinCallback);

/* ---------------------- GITLAB ---------------------- */
router.get("/gitlab", gitlabLogin);
router.get("/gitlab/callback", gitlabCallback);

/* ---------------------- TWITCH ---------------------- */
router.get("/twitch", twitchLogin);
router.get("/twitch/callback", twitchCallback);

/* ---------------------- BITBUCKET ---------------------- */
router.get("/bitbucket", bitbucketLogin);
router.get("/bitbucket/callback", bitbucketCallback);

/* ---------------------- MICROSOFT ---------------------- */
router.get("/microsoft", microsoftLogin);
router.get("/microsoft/callback", microsoftCallback);

export default router;

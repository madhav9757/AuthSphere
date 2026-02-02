/**
 * @swagger
 * tags:
 *   name: SDK
 *   description: SDK Authentication Endpoints
 */

/**
 * @swagger
 * /sdk/authorize:
 *   get:
 *     summary: Initiate OAuth flow
 *     tags: [SDK]
 *     parameters:
 *       - in: query
 *         name: public_key
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: redirect_uri
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: provider
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: response_type
 *         schema:
 *           type: string
 *           enum: [code]
 *         required: true
 *       - in: query
 *         name: code_challenge
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       302:
 *         description: Redirect to provider or login page
 *       400:
 *         description: Invalid parameters
 */

/**
 * @swagger
 * /sdk/token:
 *   post:
 *     summary: Exchange authorization code for tokens
 *     tags: [SDK]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - public_key
 *             properties:
 *               code:
 *                 type: string
 *               public_key:
 *                 type: string
 *               code_verifier:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens issued
 *       400:
 *         description: Invalid code or verifier
 */

/**
 * @swagger
 * /sdk/register:
 *   post:
 *     summary: Register a local user via SDK
 *     tags: [SDK]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - public_key
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               public_key:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 */

/**
 * @swagger
 * /sdk/login-local:
 *   post:
 *     summary: Login a local user via SDK
 *     tags: [SDK]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - public_key
 *               - sdk_request
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               public_key:
 *                 type: string
 *               sdk_request:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful (redirect callback)
 */

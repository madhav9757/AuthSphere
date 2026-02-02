/**
 * @swagger
 * tags:
 *   name: Developer
 *   description: Developer account management
 */

/**
 * @swagger
 * /developer/register:
 *   post:
 *     summary: Register a new developer
 *     tags: [Developer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Developer registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Developer already exists
 */

/**
 * @swagger
 * /developer/login:
 *   post:
 *     summary: Login for developers
 *     tags: [Developer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /developer/me:
 *   get:
 *     summary: Get current developer profile
 *     tags: [Developer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Developer profile found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /developer/logout:
 *   post:
 *     summary: Logout developer
 *     tags: [Developer]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

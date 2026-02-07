import axios from "axios";
import crypto from "crypto";
import Project from "../models/project.model.js";

/**
 * Sends a webhook notification to the registered URL
 * @param {string} projectId - The ID of the project
 * @param {string} event - The event type (e.g., 'user.registered')
 * @param {Object} data - The payload data
 */
export const triggerWebhook = async (projectId, event, data) => {
  try {
    const project = await Project.findById(projectId);
    if (!project || !project.webhooks || project.webhooks.length === 0) return;

    const payload = {
      event,
      timestamp: new Date().toISOString(),
      projectId: project._id,
      data,
    };

    const payloadString = JSON.stringify(payload);

    const promises = project.webhooks
      .filter((webhook) => webhook.isActive && webhook.events.includes(event))
      .map(async (webhook) => {
        try {
          // Generate signature
          const signature = crypto
            .createHmac("sha256", webhook.secret)
            .update(payloadString)
            .digest("hex");

          await axios.post(webhook.url, payload, {
            headers: {
              "Content-Type": "application/json",
              "X-AuthSphere-Signature": signature,
              "X-AuthSphere-Event": event,
            },
            timeout: 5000, // 5 second timeout
          });

          console.log(
            `✅ Webhook sent successfully to ${webhook.url} for event ${event}`,
          );
        } catch (error) {
          console.error(`❌ Webhook failed for ${webhook.url}:`, error.message);
          // In a real production app, we would implement a retry queue here (e.g., BullMQ/Redis)
        }
      });

    await Promise.all(promises);
  } catch (error) {
    console.error("Critical: Failed to trigger webhooks:", error.message);
  }
};

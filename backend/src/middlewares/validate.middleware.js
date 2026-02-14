import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (req.logger) {
        req.logger.error("Validation failed", {
          body: req.body,
          errors: error.errors,
        });
      }

      const errorMessages = error.errors?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })) || [{ message: error.message || "Unknown validation error" }];

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessages,
      });
    }
    next(error);
  }
};

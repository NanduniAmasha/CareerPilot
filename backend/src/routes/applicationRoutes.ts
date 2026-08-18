import { Router } from "express";

import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats
} from "../controllers/applicationController";

import {
  authenticate
} from "../middleware/authMiddleware";

import {
  applicationSchema,
  updateApplicationSchema
} from "../validators/applicationValidator.js";

import {
  validate
} from "../middleware/validateMiddleware.js";

import { AuthRequest } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/test-auth", (req: AuthRequest, res) => {
  res.json({
    message: "Authentication works",
    user: req.user
  });
});

router.get("/stats", getApplicationStats);

router.get("/", getApplications);

router.get("/:id", getApplication);

router.post("/", validate(applicationSchema), createApplication);

router.patch("/:id", validate(updateApplicationSchema), updateApplication);

router.delete("/:id", deleteApplication);

export default router;
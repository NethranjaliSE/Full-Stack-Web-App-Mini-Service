import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getJobs, 
  getJobById, 
  createJob,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();


router.get("/", getJobs);
router.get("/:id", getJobById);

//  Only logged-in Homeowners can create or delete tasks
router.post("/", protect, authorizeRoles("Homeowner"), createJob);
router.delete("/:id", protect, authorizeRoles("Homeowner"), deleteJob);

// Only logged-in Taskers can change task execution states
router.patch("/:id", protect, authorizeRoles("Tradesperson"), updateJobStatus);

export default router;

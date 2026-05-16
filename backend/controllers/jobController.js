import JobRequest from "../models/JobRequest.js";


//    GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    const jobs = await JobRequest.find(query).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};


//    GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job request not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};


// @route   POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    } = req.body;

    const newJob = new JobRequest({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    next(error);
  }
};


//    PATCH /api/jobs/:id
export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const updatedJob = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job request not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// 
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const deletedJob = await JobRequest.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job request not found" });
    }
    res.status(200).json({ message: "Job request successfully deleted" });
  } catch (error) {
    next(error);
  }
};

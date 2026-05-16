import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../server.js";
import JobRequest from "../models/JobRequest.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

dotenv.config();

let homeownerToken;
let testJobId;

beforeAll(async () => {
 
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  
  await User.deleteMany({});
  await JobRequest.deleteMany({});

  const testUser = await User.create({
    name: "Testing Homeowner",
    email: "test_owner@example.com",
    password: "password123",
    role: "Homeowner",
  });

  // Generate a valid signed JWT for authorization headers
  homeownerToken = jwt.sign(
    { id: testUser._id, name: testUser.name, role: testUser.role },
    process.env.JWT_SECRET || "super_secret_interview_key",
    { expiresIn: "1h" },
  );
});

afterAll(async () => {
  // Clean up database records and close connections down safely
  await User.deleteMany({});
  await JobRequest.deleteMany({});
  await mongoose.connection.close();
});

describe(" Automated Task Board Endpoint Verification Suite", () => {
  // Test 1: POST /api/jobs (Create a job with valid authorization tokens)
  it("POST /api/jobs -> Should successfully create a new job request when authenticated as Homeowner", async () => {
    const newJobPayload = {
      title: "Repair bathroom pipe leak",
      description: "Water leaking slowly under the shower floor basin.",
      category: "Plumbing",
      location: "Glasgow",
      contactName: "Testing Homeowner",
      contactEmail: "test_owner@example.com",
    };

    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${homeownerToken}`)
      .send(newJobPayload)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(newJobPayload.title);
    expect(res.body.status).toBe("Open"); 
    testJobId = res.body._id; 
  });

  //  POST /api/jobs (Validation Guard check)

  it("POST /api/jobs -> Should reject creations with 401 if authorization token is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({ title: "Anonymous Job", category: "Painting" })
      .expect(401);
  });

  //  GET /api/jobs (Fetch listing arrays with active filtering matrix)
  it("GET /api/jobs -> Should retrieve a list of all active jobs with query filtering parameters applied", async () => {
    const res = await request(app)
      .get("/api/jobs?category=Plumbing&status=Open")
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0].category).toBe("Plumbing");
      expect(res.body[0].status).toBe("Open");
    }
  });

  //  GET /api/jobs/:id (Fetch unique single task detail pages)
  it("GET /api/jobs/:id -> Should fetch a single task request object accurately by its unique database ID", async () => {
    const res = await request(app).get(`/api/jobs/${testJobId}`).expect(200);

    expect(res.body._id).toBe(testJobId);
    expect(res.body.title).toBe("Repair bathroom pipe leak");
  });

  //  DELETE /api/jobs/:id (Wipe record cleanly)
  it("DELETE /api/jobs/:id -> Should permit a Homeowner to permanently remove their request entry", async () => {
    await request(app)
      .delete(`/api/jobs/${testJobId}`)
      .set("Authorization", `Bearer ${homeownerToken}`)
      .expect(200);

    // Verify it's actually gone from the database
    await request(app).get(`/api/jobs/${testJobId}`).expect(404);
  });
});

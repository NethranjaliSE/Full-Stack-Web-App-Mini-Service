// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import JobRequest from "./models/JobRequest.js";
import User from "./models/User.js"; 

dotenv.config();

const sampleUsers = [
  {
    name: "Jane Doe",
    email: "homeowner@test.com",
    password: "password123", 
    role: "Homeowner",
  },
  {
    name: "Alex Smith",
    email: "tasker@test.com",
    password: "password123", 
    role: "Tradesperson",
  },
];

const sampleJobs = [
  {
    title: "Fix leaking kitchen tap",
    description: "Water dripping rapidly under the sink. Need urgent repair.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Jane Doe",
    contactEmail: "homeowner@test.com",
    status: "Open",
  },
  {
    title: "Install 6 dimmable LED spotlights in living room ceiling",
    description:
      "Looking for a qualified electrician to supply and fit 6 dimmable LED spotlights into a plasterboard ceiling. The room currently has a single pendant light. The switch needs to be replaced with a trailing-edge dimmer toggle.",
    category: "Electrical",
    location: "Glasgow",
    contactName: "Jane Doe",
    contactEmail: "homeowner@test.com",
    status: "Open",
  },
  {
    title: "Investigate tripping RCD circuit breaker in kitchen",
    description:
      "Our main RCD switch keeps flipping every time the washing machine or microwave starts up, knocking out power to all kitchen sockets. Need an experienced sparky to run a quick diagnostic test and resolve it safely.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Fiona Campbell",
    contactEmail: "fiona.c@example.com",
    status: "Open",
  },
  {
    title: "Repaint double bedroom",
    description:
      "Walls and ceiling require 2 coats of emulsion paint. Paint provided.",
    category: "Painting",
    location: "Glasgow",
    contactName: "Bob Jones",
    contactEmail: "bob@example.com",
    status: "Open",
  },
  {
    title: "Install outdoor security camera and floodlight",
    description:
      "Need an electrician to mount an integrated ring camera and LED floodlight unit above the garage doors. Cables need to be run safely through the brickwork and wired into the mains consumer unit.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "David Miller",
    contactEmail: "david.m@example.com",
    status: "Open",
  },
  {
    title: "End of tenancy deep clean for 2-bed flat",
    description:
      "Full end-of-tenancy cleaning required for a moving inspection. Must include thorough interior window washing, oven degreasing, bathroom descaling, and deep carpet vacuuming throughout.",
    category: "Cleaning",
    location: "London",
    contactName: "Sarah Jenkins",
    contactEmail: "sarah.j@example.com",
    status: "Open",
  },
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB. Starting database wipe...");

   
    await User.deleteMany({});
    await JobRequest.deleteMany({});
    console.log("Existing data cleared successfully.");

    await User.create(sampleUsers);
    console.log(
      "Test accounts ('homeowner@test.com' / 'tasker@test.com') created!",
    );

    
    await JobRequest.insertMany(sampleJobs);
    console.log("Sample job requests inserted successfully.");

    console.log("\n Database seeded perfectly for your interview review!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(" Seeding failed:", err);
    process.exit(1);
  });

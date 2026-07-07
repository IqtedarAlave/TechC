import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TechC database...");

  // ── Admin user ──────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@techc.app" },
    update: {},
    create: {
      email: "admin@techc.app",
      name: "TechC Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // ── Demo student ─────────────────────────────────────────────────
  const studentPassword = await bcrypt.hash("student123", 12);
  const studentUser = await prisma.user.upsert({
    where: { email: "demo@student.bd" },
    update: {},
    create: {
      email: "demo@student.bd",
      name: "Iqtedar Hossain",
      password: studentPassword,
      role: "STUDENT",
      studentProfile: {
        create: {
          username: "iqtedar",
          university: "BUET",
          department: "CSE",
          graduationYear: 2025,
          careerPath: "WEB_DEV",
          bio: "Final-year CSE student building TechC. Interested in scalable web systems.",
          githubUrl: "https://github.com/iqtedar",
          skills: ["React", "Next.js", "Node.js", "PostgreSQL", "TypeScript"],
          isPublic: true,
        },
      },
    },
  });
  console.log("✅ Demo student:", studentUser.email);

  // ── Demo employer ────────────────────────────────────────────────
  const employerPassword = await bcrypt.hash("employer123", 12);
  const employerUser = await prisma.user.upsert({
    where: { email: "hr@demotech.bd" },
    update: {},
    create: {
      email: "hr@demotech.bd",
      name: "HR Manager",
      password: employerPassword,
      role: "EMPLOYER",
      employerProfile: {
        create: {
          companyName: "Demo Tech BD",
          website: "https://demotech.bd",
          industry: "Software / IT",
          size: "11-50",
          location: "Dhaka, Bangladesh",
          description: "Demo company for TechC testing.",
          isVerified: true,
        },
      },
    },
  });
  console.log("✅ Demo employer:", employerUser.email);

  // ── Career Roadmaps ──────────────────────────────────────────────

  // WEB DEV
  const webDevRoadmap = await prisma.careerRoadmap.upsert({
    where: { path: "WEB_DEV" },
    update: {},
    create: {
      path: "WEB_DEV",
      title: "Web Development",
      description: "Full-stack web development from fundamentals to production-ready apps.",
      skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
    },
  });

  const webDevProjects = [
    {
      title: "Personal Portfolio Website",
      description: "Build a responsive personal portfolio with About, Projects, and Contact sections. Deploy on Vercel. Must have a working contact form.",
      difficulty: "junior",
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      order: 1,
    },
    {
      title: "REST API with Node.js & Express",
      description: "Build a full CRUD REST API for a resource of your choice. Must include proper error handling, input validation, status codes, and Postman documentation.",
      difficulty: "junior",
      skills: ["Node.js", "Express", "REST API", "Postman"],
      order: 2,
    },
    {
      title: "React Todo App with Persistence",
      description: "Task manager app with categories, priorities, due dates, and localStorage persistence. Include filter and sort. Deploy on Vercel.",
      difficulty: "junior",
      skills: ["React", "useState", "useEffect", "LocalStorage", "Tailwind CSS"],
      order: 3,
    },
    {
      title: "Full-Stack CRUD App with Authentication",
      description: "Build a complete full-stack application with user registration/login, JWT auth, protected routes, and a PostgreSQL database via Prisma ORM.",
      difficulty: "mid",
      skills: ["Next.js", "PostgreSQL", "Prisma", "JWT", "bcrypt"],
      order: 4,
    },
    {
      title: "Real-Time Chat Application",
      description: "Multi-room chat system with WebSockets, typing indicators, online user list, and message history stored in a database.",
      difficulty: "mid",
      skills: ["Socket.io", "Node.js", "React", "Redis", "PostgreSQL"],
      order: 5,
    },
    {
      title: "E-commerce Backend System",
      description: "Production-grade e-commerce API with product catalog, cart, order management, payment webhook simulation, and admin routes.",
      difficulty: "senior",
      skills: ["Node.js", "PostgreSQL", "Redis", "REST API", "Docker"],
      order: 6,
    },
    {
      title: "CI/CD Pipeline & Cloud Deployment",
      description: "Set up a full CI/CD pipeline for a web app using GitHub Actions, automated testing, Docker containerization, and deployment to a cloud platform.",
      difficulty: "senior",
      skills: ["GitHub Actions", "Docker", "Nginx", "Linux", "Railway"],
      order: 7,
    },
  ];

  for (const p of webDevProjects) {
    await prisma.roadmapProject.upsert({
      where: { id: `webdev-${p.order}` },
      update: {},
      create: { id: `webdev-${p.order}`, roadmapId: webDevRoadmap.id, ...p },
    });
  }
  console.log("✅ Web Dev roadmap:", webDevProjects.length, "projects");

  // AI/ML
  const aiRoadmap = await prisma.careerRoadmap.upsert({
    where: { path: "AI_ML" },
    update: {},
    create: {
      path: "AI_ML",
      title: "AI / Machine Learning",
      description: "From Python fundamentals to production ML models and MLOps.",
      skills: ["Python", "NumPy", "Pandas", "scikit-learn", "TensorFlow", "PyTorch", "FastAPI"],
    },
  });

  const aiProjects = [
    {
      title: "Data Analysis & Visualization Project",
      description: "Pick a public dataset (Kaggle recommended). Perform EDA, clean data, and create meaningful visualizations. Write a report explaining your findings.",
      difficulty: "junior",
      skills: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter"],
      order: 1,
    },
    {
      title: "Supervised ML Classification Model",
      description: "Train and evaluate a classification model on a real dataset. Must include feature engineering, cross-validation, confusion matrix, and performance report.",
      difficulty: "junior",
      skills: ["scikit-learn", "Python", "Pandas", "NumPy"],
      order: 2,
    },
    {
      title: "CNN Image Classification System",
      description: "Train a CNN to classify images in a custom or Kaggle dataset. Must include data augmentation, training/val curves, and a simple inference script.",
      difficulty: "mid",
      skills: ["TensorFlow", "Keras", "Python", "CNN", "NumPy"],
      order: 3,
    },
    {
      title: "NLP Text Classification API",
      description: "Build a text classification model (sentiment, spam, topic) and wrap it in a FastAPI endpoint. Include model versioning and a simple test client.",
      difficulty: "mid",
      skills: ["Python", "FastAPI", "HuggingFace", "scikit-learn", "Docker"],
      order: 4,
    },
    {
      title: "End-to-End ML Pipeline with MLflow",
      description: "Build a complete ML pipeline: data ingestion, preprocessing, training, evaluation, and model registry using MLflow. Deploy as an API.",
      difficulty: "senior",
      skills: ["MLflow", "Python", "FastAPI", "Docker", "PostgreSQL"],
      order: 5,
    },
  ];

  for (const p of aiProjects) {
    await prisma.roadmapProject.upsert({
      where: { id: `aiml-${p.order}` },
      update: {},
      create: { id: `aiml-${p.order}`, roadmapId: aiRoadmap.id, ...p },
    });
  }
  console.log("✅ AI/ML roadmap:", aiProjects.length, "projects");

  // CYBERSECURITY
  const cyberRoadmap = await prisma.careerRoadmap.upsert({
    where: { path: "CYBERSECURITY" },
    update: {},
    create: {
      path: "CYBERSECURITY",
      title: "Cybersecurity",
      description: "Ethical hacking, vulnerability analysis, and secure systems development.",
      skills: ["Linux", "Python", "Networking", "OWASP", "Burp Suite", "CTF", "Bash"],
    },
  });

  const cyberProjects = [
    {
      title: "Linux Security Hardening Checklist & Report",
      description: "Harden a fresh Ubuntu server: disable root SSH, set up UFW, configure fail2ban, audit users, and document every step with justification.",
      difficulty: "junior",
      skills: ["Linux", "Bash", "UFW", "SSH", "fail2ban"],
      order: 1,
    },
    {
      title: "OWASP Top 10 Vulnerability Lab",
      description: "Set up DVWA or a similar vulnerable app. Demonstrate and document at least 5 OWASP Top 10 vulnerabilities with screenshots and remediation steps.",
      difficulty: "junior",
      skills: ["OWASP", "Burp Suite", "DVWA", "HTTP", "XSS", "SQLi"],
      order: 2,
    },
    {
      title: "Python Network Scanner & Port Monitor",
      description: "Build a Python tool that scans a subnet, identifies open ports, detects services, and generates a structured report. Include alerting for new open ports.",
      difficulty: "mid",
      skills: ["Python", "Scapy", "Nmap", "Sockets", "Networking"],
      order: 3,
    },
    {
      title: "CTF Write-up Collection (3 challenges)",
      description: "Complete and document 3 CTF challenges from HackTheBox or TryHackMe. Write detailed step-by-step explanations for each solution.",
      difficulty: "mid",
      skills: ["CTF", "Linux", "Reverse Engineering", "Web Security"],
      order: 4,
    },
    {
      title: "Secure API Design & Penetration Test Report",
      description: "Build a REST API following security best practices, then conduct a self-pentest. Document vulnerabilities found, exploits attempted, and fixes applied.",
      difficulty: "senior",
      skills: ["Node.js", "OWASP", "Burp Suite", "JWT", "Rate Limiting"],
      order: 5,
    },
  ];

  for (const p of cyberProjects) {
    await prisma.roadmapProject.upsert({
      where: { id: `cyber-${p.order}` },
      update: {},
      create: { id: `cyber-${p.order}`, roadmapId: cyberRoadmap.id, ...p },
    });
  }
  console.log("✅ Cybersecurity roadmap:", cyberProjects.length, "projects");

  // EMBEDDED SYSTEMS (EEE)
  const embeddedRoadmap = await prisma.careerRoadmap.upsert({
    where: { path: "EMBEDDED_SYSTEMS" },
    update: {},
    create: {
      path: "EMBEDDED_SYSTEMS",
      title: "Embedded Systems",
      description: "Firmware, microcontrollers, IoT, and real-time systems for EEE students.",
      skills: ["C", "C++", "Arduino", "STM32", "RTOS", "FPGA", "Embedded C", "I2C", "SPI", "UART"],
    },
  });

  const embeddedProjects = [
    {
      title: "Arduino Sensor Dashboard",
      description: "Read from 3+ sensors (DHT11, ultrasonic, IR) using Arduino, display data on LCD, and log readings to serial. Document wiring and code.",
      difficulty: "junior",
      skills: ["Arduino", "C", "Sensors", "LCD", "Serial Communication"],
      order: 1,
    },
    {
      title: "UART/I2C/SPI Protocol Implementation",
      description: "Implement communication between two microcontrollers using all three protocols. Demonstrate data exchange with oscilloscope screenshots or logic analyzer output.",
      difficulty: "junior",
      skills: ["STM32", "UART", "I2C", "SPI", "Embedded C"],
      order: 2,
    },
    {
      title: "RTOS Task Scheduler (FreeRTOS)",
      description: "Build a multitasking embedded application using FreeRTOS. Implement at least 3 concurrent tasks, semaphores, and a task monitor over UART.",
      difficulty: "mid",
      skills: ["FreeRTOS", "STM32", "C", "RTOS", "Semaphores"],
      order: 3,
    },
    {
      title: "IoT Smart Home Module",
      description: "Build a WiFi-enabled sensor node (ESP32) that pushes readings to an MQTT broker and a simple web dashboard. Include OTA firmware update capability.",
      difficulty: "mid",
      skills: ["ESP32", "MQTT", "IoT", "C++", "WiFi", "Node-RED"],
      order: 4,
    },
    {
      title: "FPGA Digital System Design",
      description: "Design and implement a digital system (UART controller, simple CPU, or image processing block) on an FPGA using VHDL or Verilog. Include testbench.",
      difficulty: "senior",
      skills: ["FPGA", "VHDL", "Verilog", "Xilinx", "Testbench"],
      order: 5,
    },
  ];

  for (const p of embeddedProjects) {
    await prisma.roadmapProject.upsert({
      where: { id: `embedded-${p.order}` },
      update: {},
      create: { id: `embedded-${p.order}`, roadmapId: embeddedRoadmap.id, ...p },
    });
  }
  console.log("✅ Embedded Systems roadmap:", embeddedProjects.length, "projects");

  // DATA SCIENCE
  const dsRoadmap = await prisma.careerRoadmap.upsert({
    where: { path: "DATA_SCIENCE" },
    update: {},
    create: {
      path: "DATA_SCIENCE",
      title: "Data Science",
      description: "Data wrangling, statistical analysis, and business-focused analytics.",
      skills: ["Python", "SQL", "Pandas", "Tableau", "Power BI", "Statistics", "Excel"],
    },
  });

  const dsProjects = [
    {
      title: "Bangladesh Dataset Analysis",
      description: "Find a Bangladesh-specific public dataset (census, health, economics). Perform thorough EDA and present 5 actionable insights with visualizations.",
      difficulty: "junior",
      skills: ["Python", "Pandas", "Matplotlib", "Statistics"],
      order: 1,
    },
    {
      title: "SQL Analytics Project",
      description: "Load a relational dataset into PostgreSQL. Write 15+ queries including JOINs, window functions, CTEs, and aggregations. Export results to a report.",
      difficulty: "junior",
      skills: ["SQL", "PostgreSQL", "Data Analysis"],
      order: 2,
    },
    {
      title: "Business Intelligence Dashboard",
      description: "Connect a dataset to Tableau Public or Power BI. Build an interactive dashboard with filters, KPI cards, trend analysis, and executive summary.",
      difficulty: "mid",
      skills: ["Tableau", "Power BI", "Data Visualization", "Business Analysis"],
      order: 3,
    },
    {
      title: "Predictive Analytics Model",
      description: "Build a regression or forecasting model for a business use case. Include feature importance analysis, confidence intervals, and business recommendations.",
      difficulty: "mid",
      skills: ["Python", "scikit-learn", "Statistical Modeling", "Forecasting"],
      order: 4,
    },
  ];

  for (const p of dsProjects) {
    await prisma.roadmapProject.upsert({
      where: { id: `ds-${p.order}` },
      update: {},
      create: { id: `ds-${p.order}`, roadmapId: dsRoadmap.id, ...p },
    });
  }
  console.log("✅ Data Science roadmap:", dsProjects.length, "projects");

  // DEVOPS
  const devopsRoadmap = await prisma.careerRoadmap.upsert({
    where: { path: "DEVOPS" },
    update: {},
    create: {
      path: "DEVOPS",
      title: "DevOps / Cloud",
      description: "Infrastructure, CI/CD pipelines, containerization, and cloud deployment.",
      skills: ["Linux", "Docker", "Kubernetes", "GitHub Actions", "Nginx", "AWS", "Terraform", "Bash"],
    },
  });

  const devopsProjects = [
    {
      title: "Linux Server Administration Project",
      description: "Set up a fresh Ubuntu server: user management, firewall, SSH hardening, cron jobs, log rotation, and system monitoring. Document everything.",
      difficulty: "junior",
      skills: ["Linux", "Bash", "SSH", "Cron", "UFW", "systemd"],
      order: 1,
    },
    {
      title: "Dockerize a Full-Stack Application",
      description: "Containerize a web app (frontend + backend + database) using Docker. Write a docker-compose.yml that starts everything with one command.",
      difficulty: "junior",
      skills: ["Docker", "docker-compose", "Nginx", "PostgreSQL"],
      order: 2,
    },
    {
      title: "GitHub Actions CI/CD Pipeline",
      description: "Build a complete CI/CD pipeline: lint → test → build Docker image → push to registry → deploy to a cloud VM. Include branch protection rules.",
      difficulty: "mid",
      skills: ["GitHub Actions", "Docker", "CI/CD", "Shell Scripting"],
      order: 3,
    },
    {
      title: "Kubernetes Deployment & Scaling",
      description: "Deploy a multi-service application on a Kubernetes cluster (local Minikube or free cloud tier). Include HPA, ConfigMaps, Secrets, and health checks.",
      difficulty: "senior",
      skills: ["Kubernetes", "Docker", "Helm", "kubectl", "HPA"],
      order: 4,
    },
    {
      title: "Infrastructure as Code with Terraform",
      description: "Define cloud infrastructure (VPC, compute, database, storage) using Terraform. Must be reproducible with terraform apply from a clean state.",
      difficulty: "senior",
      skills: ["Terraform", "AWS", "IaC", "Cloud Architecture"],
      order: 5,
    },
  ];

  for (const p of devopsProjects) {
    await prisma.roadmapProject.upsert({
      where: { id: `devops-${p.order}` },
      update: {},
      create: { id: `devops-${p.order}`, roadmapId: devopsRoadmap.id, ...p },
    });
  }
  console.log("✅ DevOps roadmap:", devopsProjects.length, "projects");

  // UI/UX
  const uiuxRoadmap = await prisma.careerRoadmap.upsert({
    where: { path: "UI_UX" },
    update: {},
    create: {
      path: "UI_UX",
      title: "UI / UX Design",
      description: "User research, wireframing, prototyping, and design systems.",
      skills: ["Figma", "User Research", "Wireframing", "Prototyping", "CSS", "Accessibility", "Design Systems"],
    },
  });

  const uiuxProjects = [
    {
      title: "Mobile App UI Redesign",
      description: "Pick any popular BD app (bKash, Pathao, Shajgoj). Research UX problems, design a redesign in Figma with 10+ screens and a style guide.",
      difficulty: "junior",
      skills: ["Figma", "UI Design", "Mobile Design", "Style Guide"],
      order: 1,
    },
    {
      title: "UX Research Report & User Testing",
      description: "Conduct user research for a problem you identify. Write a research plan, run 5+ user interviews, synthesize findings, and present recommendations.",
      difficulty: "junior",
      skills: ["User Research", "Interviews", "Affinity Mapping", "UX Writing"],
      order: 2,
    },
    {
      title: "Interactive Prototype with User Testing",
      description: "Design and prototype a complete user flow (signup to core action) in Figma. Run usability tests with 5 real users. Document findings and iterate.",
      difficulty: "mid",
      skills: ["Figma", "Prototyping", "Usability Testing", "Iteration"],
      order: 3,
    },
    {
      title: "Design System & Component Library",
      description: "Build a complete design system for a product: color tokens, typography scale, spacing grid, 30+ components, and usage documentation.",
      difficulty: "senior",
      skills: ["Figma", "Design Systems", "Components", "Documentation", "Tokens"],
      order: 4,
    },
  ];

  for (const p of uiuxProjects) {
    await prisma.roadmapProject.upsert({
      where: { id: `uiux-${p.order}` },
      update: {},
      create: { id: `uiux-${p.order}`, roadmapId: uiuxRoadmap.id, ...p },
    });
  }
  console.log("✅ UI/UX roadmap:", uiuxProjects.length, "projects");

  // ── Demo jobs ─────────────────────────────────────────────────────
  const employer = await prisma.employerProfile.findFirst({
    where: { user: { email: "hr@demotech.bd" } },
  });

  if (employer) {
    await prisma.job.upsert({
      where: { id: "demo-job-1" },
      update: {},
      create: {
        id: "demo-job-1",
        employerId: employer.id,
        title: "Junior Frontend Developer",
        description: "Join our product team building scalable web apps. You'll own features end-to-end and ship to thousands of users.",
        requirements: ["React / Next.js", "TypeScript basics", "Familiar with REST APIs", "Basic Git workflow"],
        careerPath: "WEB_DEV",
        jobType: "FULL_TIME",
        salaryRange: "20,000–30,000 BDT",
        location: "Dhaka",
        isActive: true,
      },
    });

    await prisma.job.upsert({
      where: { id: "demo-job-2" },
      update: {},
      create: {
        id: "demo-job-2",
        employerId: employer.id,
        title: "React Intern",
        description: "3-month internship with real product work. Strong performers receive return offers.",
        requirements: ["React fundamentals", "JavaScript ES6+", "Git"],
        careerPath: "WEB_DEV",
        jobType: "INTERNSHIP",
        salaryRange: "12,000–15,000 BDT",
        location: "Remote",
        isActive: true,
      },
    });
    console.log("✅ Demo jobs created");
  }

  console.log("\n🎉 Seed complete!\n");
  console.log("Demo accounts:");
  console.log("  Admin    → admin@techc.app       / admin123");
  console.log("  Student  → demo@student.bd       / student123");
  console.log("  Employer → hr@demotech.bd        / employer123\n");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

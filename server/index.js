const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// CORS configuration
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "pfe_session",
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 * 1000, // 24 hours in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(express.json());

// Database connection
const db = mysql.createConnection({
  user: process.env.DB_USER || "root",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pfe",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
    // Create default admin user if not exists
    createDefaultAdmin();
  }
});

// Function to create default admin user on server startup
const createDefaultAdmin = () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@pfe.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  // Check if admin user already exists
  db.query("SELECT id FROM users WHERE email = ? AND role = 3", [adminEmail], (err, result) => {
    if (err) {
      console.error("Error checking for admin user:", err);
      return;
    }

    if (result.length === 0) {
      // Create admin user
      db.query(
        "INSERT INTO users (email, password, firstName, lastName, role, valid) VALUES (?, ?, ?, ?, 3, 1)",
        [adminEmail, adminPassword, "Admin", "System"],
        (err, result) => {
          if (err) {
            console.error("Error creating admin user:", err);
          } else {
            console.log("Default admin user created successfully");
            console.log(`  Email: ${adminEmail}`);
            console.log(`  Password: ${adminPassword}`);
          }
        }
      );
    } else {
      console.log("Admin user already exists");
    }
  });
};

// ************************* JWT Middleware *****************************

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      idFiliere: user.idFiliere
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};

// Role-based access control middleware
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

// Role constants for clarity
const ROLES = {
  PROFESSOR: 0,
  CHEF_DEPARTEMENT: 1,
  STUDENT: 2,
  ADMIN: 3
};

// ************************* Public Routes (No Auth Required) *****************************

// Get filieres for registration dropdown
app.get("/filiere", (req, res) => {
  db.query("SELECT idFiliere, name FROM filiere", (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(result);
    }
  });
});

// Get prerequisites for registration
app.get("/prerequi", (req, res) => {
  db.query(
    "SELECT idFiliere, idprerequis, name FROM prerequis",
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(result);
      }
    }
  );
});

// Register new student
app.post("/registerStudent", async (req, res) => {
  // Accept both 'department' (from frontend) and 'filiere' (legacy) for the department field
  const {
    department,
    filiere,
    firstName,
    lastName,
    phone,
    email,
    password,
    role,
    cne,
    cin,
    dateNaissance,
    idPrerequisites
  } = req.body;

  // Use department if provided, otherwise fall back to filiere
  const idFiliere = department || filiere;

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "The Email already exists" });
    }

    db.query(
      "INSERT INTO users (email, password, firstName, lastName, idFiliere, phone, role, valid, cne, cin, dateNaissance) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)",
      [email, password, firstName, lastName, idFiliere, phone, role, cne || null, cin || null, dateNaissance || null],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Registration failed" });
        }

        const idStd = result.insertId;

        if (idPrerequisites && Array.isArray(idPrerequisites)) {
          idPrerequisites.forEach((prerequi) => {
            db.query(
              "INSERT INTO studentspre (idStd, idPrerequi) VALUES (?, ?)",
              [idStd, prerequi]
            );
          });
        }

        res.status(201).json({ message: "Registration successful", userId: idStd });
      }
    );
  });
});

// ************************* Login *****************************

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length > 0) {
        const user = result[0];

        // Check if student is activated
        if (user.role === 2 && user.valid === 0) {
          return res.status(403).json({ message: "Account not yet activated" });
        }

        // Generate JWT token
        const token = generateToken(user);

        req.session.user = user;
        res.cookie("filId", user.idFiliere);
        res.cookie("userId", user.id);
        res.cookie("auth", token); // Store JWT token instead of boolean
        res.cookie("role", user.role);

        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          idFiliere: user.idFiliere,
          token: token // Return token in response body as well
        });
      } else {
        res.status(401).json({ message: "Wrong email/password combination!" });
      }
    }
  );
});

// Verify token endpoint (for checking if user is still authenticated)
app.get("/verify-token", verifyToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      idFiliere: req.user.idFiliere
    }
  });
});

// Refresh token endpoint
app.post("/refresh-token", verifyToken, (req, res) => {
  // Get user info from database to ensure it's still valid
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.user.id],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const user = result[0];
      const newToken = generateToken(user);

      res.json({ token: newToken });
    }
  );
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("filId");
  res.clearCookie("userId");
  res.clearCookie("auth");
  res.clearCookie("role");
  res.json({ message: "Logged out successfully" });
});

// ************************* Protected Routes *****************************

// ************************* Admin Routes (Role: 3) *****************************

// Admin dashboard stats
app.get("/admin/stats", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  const stats = {
    professors: 0,
    chefDepartements: 0,
    students: 0,
    pendingStudents: 0,
    filieres: 0
  };

  let completed = 0;
  const total = 5;

  const checkComplete = () => {
    completed++;
    if (completed === total) {
      res.json(stats);
    }
  };

  // Count professors
  db.query("SELECT COUNT(*) as count FROM users WHERE role = 0", (err, result) => {
    if (!err && result[0]) stats.professors = result[0].count;
    checkComplete();
  });

  // Count chefs de département
  db.query("SELECT COUNT(*) as count FROM users WHERE role = 1", (err, result) => {
    if (!err && result[0]) stats.chefDepartements = result[0].count;
    checkComplete();
  });

  // Count activated students
  db.query("SELECT COUNT(*) as count FROM users WHERE role = 2 AND valid = 1", (err, result) => {
    if (!err && result[0]) stats.students = result[0].count;
    checkComplete();
  });

  // Count pending students
  db.query("SELECT COUNT(*) as count FROM users WHERE role = 2 AND valid = 0", (err, result) => {
    if (!err && result[0]) stats.pendingStudents = result[0].count;
    checkComplete();
  });

  // Count filieres
  db.query("SELECT COUNT(*) as count FROM filiere", (err, result) => {
    if (!err && result[0]) stats.filieres = result[0].count;
    checkComplete();
  });
});

// Create professor/chef departement account (Admin only)
app.post("/adminCreate", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  const { email, password, role, filiere } = req.body;

  db.query(
    "INSERT INTO users (email, password, role, idFiliere, valid) VALUES (?, ?, ?, ?, 1)",
    [email, password, role, filiere],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Creation failed" });
      }
      res.status(201).json({ message: "Account created", userId: result.insertId });
    }
  );
});

// Get pending students (for admin)
app.get("/stdListe", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  db.query(
    "SELECT users.*, filiere.name as filiere FROM users, filiere WHERE users.valid = 0 AND users.role = 2 AND users.idFiliere = filiere.idFiliere",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get activated students (for admin)
app.get("/stdListeAct", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  db.query(
    "SELECT users.*, filiere.name as filiere FROM users, filiere WHERE users.valid = 1 AND users.role = 2 AND users.idFiliere = filiere.idFiliere",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get all professors (for admin)
app.get("/allProf", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  db.query(
    "SELECT users.*, filiere.name as filiere FROM users, filiere WHERE users.idFiliere = filiere.idFiliere AND users.role = 0",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get all chefs de departement (for admin)
app.get("/allChefDep", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  db.query(
    "SELECT users.*, filiere.name as filiere FROM users, filiere WHERE users.idFiliere = filiere.idFiliere AND users.role = 1",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Activate student account (Admin only)
app.put("/validStd", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  const { id } = req.body;

  db.query("UPDATE users SET valid = 1 WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Activation failed" });
    }
    res.json({ message: "Student activated" });
  });
});

// Block student account (Admin only)
app.put("/blockStd", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  const { id } = req.body;

  db.query("UPDATE users SET valid = 0 WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Block failed" });
    }
    res.json({ message: "Student blocked" });
  });
});

// Delete user (Admin only)
app.delete("/deleteUser/:id", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Delete failed" });
    }
    res.json({ message: "User deleted" });
  });
});

// Create filiere (Admin only)
app.post("/filiere", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  const { name } = req.body;

  db.query("INSERT INTO filiere (name) VALUES (?)", [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Creation failed" });
    }
    res.status(201).json({ message: "Filiere created", id: result.insertId });
  });
});

// Delete filiere (Admin only)
app.delete("/filiere/:id", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM filiere WHERE idFiliere = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Delete failed" });
    }
    res.json({ message: "Filiere deleted" });
  });
});

// ************************* Profile (All authenticated users) *****************************

// Get profile info
app.get("/profile/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  // Users can only view their own profile unless admin
  if (req.user.id != id && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: "Access denied" });
  }

  db.query(
    "SELECT users.*, filiere.name as filiere FROM users, filiere WHERE users.id = ? AND users.idFiliere = filiere.idFiliere",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0] || {});
    }
  );
});

// Get student profile with prerequisites
app.get("/profileStd/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT users.*, filiere.name as filiere, GROUP_CONCAT(prerequis.name) as prerequisites
     FROM users
     JOIN filiere ON users.idFiliere = filiere.idFiliere
     LEFT JOIN studentspre ON users.id = studentspre.idStd
     LEFT JOIN prerequis ON studentspre.idPrerequi = prerequis.idprerequis
     WHERE users.id = ?
     GROUP BY users.id`,
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0] || {});
    }
  );
});

// Update profile
app.put("/updateProfile", verifyToken, (req, res) => {
  const { id, fil, firstName, lastName, email, phone, password } = req.body;

  // Users can only update their own profile unless admin
  if (req.user.id != id && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: "Access denied" });
  }

  db.query(
    "UPDATE users SET idFiliere = ?, firstName = ?, lastName = ?, email = ?, phone = ?, password = ? WHERE id = ?",
    [fil, firstName, lastName, email, phone, password, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Update failed" });
      }
      res.json({ message: "Profile updated" });
    }
  );
});

// ************************* Chef Département & Professor Routes *****************************

// Get professors by filiere (for chef departement)
app.get("/prof/:id", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT, ROLES.ADMIN), (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT users.*, filiere.name as filiere FROM users, filiere WHERE users.idFiliere = ? AND users.role = 0 AND users.idFiliere = filiere.idFiliere",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get students by filiere (activated)
app.get("/stdListe/:id", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT, ROLES.ADMIN), (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT users.*, filiere.name as filiere FROM users, filiere WHERE users.idFiliere = ? AND users.role = 2 AND users.idFiliere = filiere.idFiliere AND valid = 1",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get prerequisites by filiere
app.get("/prerequisFil/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT idprerequis, name FROM prerequis WHERE idFiliere = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get domains by filiere
app.get("/domaineFil/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT id_domaine, name FROM domaines WHERE idFiliere = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Add new domain (Chef/Admin)
app.post("/addDomaine", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT, ROLES.ADMIN), (req, res) => {
  const { idFiliere, name } = req.body;

  db.query(
    "INSERT INTO domaines (idFiliere, name) VALUES (?, ?)",
    [idFiliere, name],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Creation failed" });
      }
      res.status(201).json({ message: "Domain created", id: result.insertId });
    }
  );
});

// Add new prerequisite (Chef/Admin)
app.post("/addPrerequi", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT, ROLES.ADMIN), (req, res) => {
  const { idFiliere, name } = req.body;

  db.query(
    "INSERT INTO prerequis (idFiliere, name) VALUES (?, ?)",
    [idFiliere, name],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Creation failed" });
      }
      res.status(201).json({ message: "Prerequisite created", id: result.insertId });
    }
  );
});

// Add new filiere (Admin/Chef)
app.post("/addFiliere", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT, ROLES.ADMIN), (req, res) => {
  const { name } = req.body;

  db.query("INSERT INTO filiere (name) VALUES (?)", [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Creation failed" });
    }
    res.status(201).json({ message: "Filiere created", id: result.insertId });
  });
});

// ************************* PFE Management (Professor/Chef) *****************************

// Create new PFE
app.post("/newPfe", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const { filiere, titre, description, nbr_etd, domaine, prof, avancement, idPrerequisites } = req.body;

  db.query(
    "INSERT INTO pfe (idFiliere, titre, description, nbr_etd, id_domaine, idProf, avancement) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [filiere, titre, description, nbr_etd, domaine, prof, avancement || "En cours"],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Creation failed" });
      }

      const idPfe = result.insertId;

      if (idPrerequisites && Array.isArray(idPrerequisites)) {
        idPrerequisites.forEach((prerequi) => {
          db.query(
            "INSERT INTO pfeprerequis (id_pfe, idPrerequis) VALUES (?, ?)",
            [idPfe, prerequi]
          );
        });
      }

      res.status(201).json({ message: "PFE created", id: idPfe });
    }
  );
});

// Get own PFEs (for professor/chef)
app.get("/myPfe/:id", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT pfe.*, filiere.name as filiere, domaines.name as domaine FROM pfe, filiere, domaines WHERE pfe.idProf = ? AND pfe.idFiliere = filiere.idFiliere AND pfe.id_domaine = domaines.id_domaine",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get all PFEs in filiere (for chef departement)
app.get("/allPfe/:id", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT, ROLES.ADMIN), (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT pfe.*, CONCAT(users.firstName, ' ', users.lastName) AS fname FROM pfe, users WHERE pfe.idFiliere = ? AND pfe.idProf = users.id AND users.role = 0",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get all PFEs for students
app.get("/allPfeStd/:id", verifyToken, requireRole(ROLES.STUDENT), (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT pfe.*, CONCAT(users.firstName, ' ', users.lastName) AS fname, domaines.name as domaine FROM pfe, users, domaines WHERE pfe.idFiliere = ? AND pfe.idProf = users.id AND pfe.id_domaine = domaines.id_domaine",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get single PFE details
app.get("/SinglePfe/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT pfe.*, domaines.name as domaine, users.email, users.phone, CONCAT(users.firstName, ' ', users.lastName) AS fname FROM pfe, domaines, users WHERE pfe.id = ? AND pfe.id_domaine = domaines.id_domaine AND users.id = pfe.idProf",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0] || {});
    }
  );
});

// Get prerequisites for PFE
app.get("/prerequisPfe/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT prerequis.name FROM prerequis, pfeprerequis WHERE pfeprerequis.id_pfe = ? AND pfeprerequis.idPrerequis = prerequis.idprerequis",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Update PFE
app.put("/updatePfe", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const { idPfe, titre, description, nbr_etd, domaine, idPrerequisites } = req.body;

  db.query(
    "UPDATE pfe SET titre = ?, description = ?, nbr_etd = ?, id_domaine = ? WHERE id = ?",
    [titre, description, nbr_etd, domaine, idPfe],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Update failed" });
      }

      // Update prerequisites
      db.query("DELETE FROM pfeprerequis WHERE id_pfe = ?", [idPfe], () => {
        if (idPrerequisites && Array.isArray(idPrerequisites)) {
          idPrerequisites.forEach((prerequi) => {
            db.query(
              "INSERT INTO pfeprerequis (id_pfe, idPrerequis) VALUES (?, ?)",
              [idPfe, prerequi]
            );
          });
        }
      });

      res.json({ message: "PFE updated" });
    }
  );
});

// Update PFE progress
app.put("/updateavan", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const { id, avancement } = req.body;

  db.query(
    "UPDATE pfe SET avancement = ? WHERE id = ?",
    [avancement, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Update failed" });
      }
      res.json({ message: "Progress updated" });
    }
  );
});

// Update defense date
app.put("/updateDateSout", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const { id, date } = req.body;

  db.query(
    "UPDATE pfe SET dateSoutenance = ? WHERE id = ?",
    [date, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Update failed" });
      }
      res.json({ message: "Defense date updated" });
    }
  );
});

// Delete PFE
app.delete("/deletePfe/:id", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT, ROLES.ADMIN), (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM pfeprerequis WHERE id_pfe = ?", [id], () => {
    db.query("DELETE FROM pfe WHERE id = ?", [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Delete failed" });
      }
      res.json({ message: "PFE deleted" });
    });
  });
});

// ************************* Demandes *****************************

// Create demande (student applies for PFE)
app.post("/addDemande", verifyToken, requireRole(ROLES.STUDENT), (req, res) => {
  const { id_pfe, id_user, id_prof } = req.body;

  db.query(
    "INSERT INTO demandes (id_pfe, id_user, idProf, dispo) VALUES (?, ?, ?, 0)",
    [id_pfe, id_user, id_prof],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Application failed" });
      }
      res.status(201).json({ message: "Application submitted", id: result.insertId });
    }
  );
});

// Get demandes for professor
app.get("/demandes/:id", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT demandes.id, DATE_FORMAT(demandes.date, '%m/%d/%Y %H:%i') as date,
     users.firstName, users.lastName, pfe.titre, users.id as idUser
     FROM demandes, users, pfe
     WHERE demandes.idProf = ? AND demandes.id_user = users.id AND demandes.id_pfe = pfe.id AND demandes.dispo = 0`,
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get PFE-student list for professor
app.get("/stdPfe/:id", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT demandes.id, DATE_FORMAT(demandes.date, '%m/%d/%Y %H:%i') as date,
     CONCAT(users.firstName, ' ', users.lastName) AS fname, pfe.avancement, pfe.id as idPfe,
     pfe.nbr_etd, pfe.titre, pfe.dateSoutenance
     FROM demandes, users, pfe
     WHERE demandes.idProf = ? AND demandes.id_user = users.id AND demandes.id_pfe = pfe.id AND demandes.dispo = 1`,
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get PFEs student applied to
app.get("/pfeOfStd/:idUser", verifyToken, requireRole(ROLES.STUDENT), (req, res) => {
  const id = req.params.idUser;

  db.query(
    `SELECT demandes.id, DATE_FORMAT(demandes.date, '%m/%d/%Y %H:%i') as date,
     CONCAT(users.firstName, ' ', users.lastName) AS fname, pfe.titre
     FROM demandes, pfe, users
     WHERE demandes.id_user = ? AND demandes.id_pfe = pfe.id AND demandes.idProf = users.id AND demandes.dispo = 0`,
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get student's assigned PFE
app.get("/MypfeOfStd/:idUser", verifyToken, requireRole(ROLES.STUDENT), (req, res) => {
  const id = req.params.idUser;

  db.query(
    `SELECT demandes.id, DATE_FORMAT(demandes.date, '%m/%d/%Y %H:%i') as date,
     CONCAT(users.firstName, ' ', users.lastName) AS fname, pfe.titre, pfe.dateSoutenance
     FROM demandes, pfe, users
     WHERE demandes.id_user = ? AND demandes.id_pfe = pfe.id AND demandes.idProf = users.id AND demandes.dispo = 1`,
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Approve demande (assign student to PFE)
app.put("/affectPfe", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const { id } = req.body;

  db.query("UPDATE demandes SET dispo = 1 WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Assignment failed" });
    }
    res.json({ message: "Student assigned to PFE" });
  });
});

// Delete demande
app.delete("/deleteDemande/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM demandes WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Delete failed" });
    }
    res.json({ message: "Demande deleted" });
  });
});

// ************************* Portal Stats *****************************

// Student dashboard stats
app.get("/student/stats", verifyToken, requireRole(ROLES.STUDENT), (req, res) => {
  const userId = req.query.userId;
  const filId = req.query.filId;

  const stats = {
    availablePfes: 0,
    myApplications: 0,
    assignedPfe: false
  };

  let completed = 0;
  const total = 3;

  const checkComplete = () => {
    completed++;
    if (completed === total) {
      res.json(stats);
    }
  };

  // Count available PFEs in student's filiere
  db.query("SELECT COUNT(*) as count FROM pfe WHERE idFiliere = ?", [filId], (err, result) => {
    if (!err && result[0]) stats.availablePfes = result[0].count;
    checkComplete();
  });

  // Count pending applications
  db.query("SELECT COUNT(*) as count FROM demandes WHERE id_user = ? AND dispo = 0", [userId], (err, result) => {
    if (!err && result[0]) stats.myApplications = result[0].count;
    checkComplete();
  });

  // Check if student has assigned PFE
  db.query("SELECT COUNT(*) as count FROM demandes WHERE id_user = ? AND dispo = 1", [userId], (err, result) => {
    if (!err && result[0]) stats.assignedPfe = result[0].count > 0;
    checkComplete();
  });
});

// Professor dashboard stats
app.get("/professor/stats", verifyToken, requireRole(ROLES.PROFESSOR, ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const userId = req.query.userId;

  const stats = {
    myPfes: 0,
    pendingRequests: 0,
    assignedStudents: 0
  };

  let completed = 0;
  const total = 3;

  const checkComplete = () => {
    completed++;
    if (completed === total) {
      res.json(stats);
    }
  };

  // Count professor's PFEs
  db.query("SELECT COUNT(*) as count FROM pfe WHERE idProf = ?", [userId], (err, result) => {
    if (!err && result[0]) stats.myPfes = result[0].count;
    checkComplete();
  });

  // Count pending requests
  db.query("SELECT COUNT(*) as count FROM demandes WHERE idProf = ? AND dispo = 0", [userId], (err, result) => {
    if (!err && result[0]) stats.pendingRequests = result[0].count;
    checkComplete();
  });

  // Count assigned students
  db.query("SELECT COUNT(*) as count FROM demandes WHERE idProf = ? AND dispo = 1", [userId], (err, result) => {
    if (!err && result[0]) stats.assignedStudents = result[0].count;
    checkComplete();
  });
});

// Dashboard stats endpoint (Chef Departement)
app.get("/stats/dashboard/:filiereId", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT, ROLES.ADMIN), (req, res) => {
  const filiereId = req.params.filiereId;

  const queries = {
    professors: "SELECT COUNT(*) as count FROM users WHERE idFiliere = ? AND role = 0",
    students: "SELECT COUNT(*) as count FROM users WHERE idFiliere = ? AND role = 2 AND valid = 1",
    pfes: "SELECT COUNT(*) as count FROM pfe WHERE idFiliere = ?",
    domains: "SELECT COUNT(*) as count FROM domaines WHERE idFiliere = ?"
  };

  const results = {};
  let completed = 0;

  Object.entries(queries).forEach(([key, query]) => {
    db.query(query, [filiereId], (err, result) => {
      if (!err && result[0]) {
        results[key] = result[0].count;
      } else {
        results[key] = 0;
      }

      completed++;
      if (completed === Object.keys(queries).length) {
        res.json({
          professorsCount: results.professors,
          studentsCount: results.students,
          pfesCount: results.pfes,
          domainsCount: results.domains
        });
      }
    });
  });
});

// ************************* Statistics (Protected) *****************************

// Get professor count by filiere (for admin charts)
app.get("/profChart", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  db.query(
    "SELECT COUNT(u.id) as num, f.name as name FROM filiere AS f LEFT JOIN users AS u ON u.idFiliere = f.idFiliere AND u.role IN(0,1) GROUP BY f.name",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get own PFE progress stats (for chef departement)
app.get("/chefDepadv/:id", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT, ROLES.PROFESSOR), (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT COUNT(pfe.id) as num, avancement FROM pfe WHERE idProf = ? GROUP BY avancement",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Get all PFE progress stats in filiere
app.get("/chefDepadvAll/:id", verifyToken, requireRole(ROLES.CHEF_DEPARTEMENT), (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT COUNT(pfe.id) as num, avancement FROM pfe WHERE idFiliere = ? GROUP BY avancement",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
    }
  );
});

// Count professors in filiere
app.get("/numProfChedDep/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT COUNT(*) as num FROM users WHERE idFiliere = ? AND role = 0",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0]);
    }
  );
});

// Count students in filiere
app.get("/numStdChedDep/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT COUNT(*) as num FROM users WHERE idFiliere = ? AND role = 2 AND valid = 1",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0]);
    }
  );
});

// Count PFEs for professor
app.get("/numPfeProf/:idUser", verifyToken, (req, res) => {
  const id = req.params.idUser;

  db.query(
    "SELECT COUNT(*) as num FROM pfe WHERE idProf = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0]);
    }
  );
});

// Count PFEs in filiere
app.get("/numPfe/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT COUNT(*) as num FROM pfe WHERE idFiliere = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0]);
    }
  );
});

// Count domains in filiere
app.get("/numDomaines/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT COUNT(*) as num FROM domaines WHERE idFiliere = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0]);
    }
  );
});

// Count all professors (for admin)
app.get("/numProf", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  db.query("SELECT COUNT(*) as num FROM users WHERE role = 0", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result[0]);
  });
});

// Count all chefs de departement (for admin)
app.get("/numChefDep", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  db.query("SELECT COUNT(*) as num FROM users WHERE role = 1", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result[0]);
  });
});

// Count all students (for admin)
app.get("/numStd", verifyToken, requireRole(ROLES.ADMIN), (req, res) => {
  db.query(
    "SELECT COUNT(*) as num FROM users WHERE role = 2 AND valid = 1",
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(result[0]);
    }
  );
});

// ************************* Password Reset (Public) *****************************

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send password reset email
app.post("/reset-password-email", (req, res) => {
  const { email } = req.body;

  db.query(
    "SELECT password FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!result[0]) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Check if email is configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ error: "Email service not configured" });
      }

      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mot de passe oublié - Gestion des PFE",
        text: `Votre mot de passe est : ${result[0].password}`,
        html: `
          <h2>Récupération de mot de passe</h2>
          <p>Votre mot de passe est : <strong>${result[0].password}</strong></p>
          <p>Nous vous recommandons de changer votre mot de passe après connexion.</p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email error:", error);
          return res.status(500).json({ error: "Failed to send email" });
        }
        res.json({ message: "Password sent to your email" });
      });
    }
  );
});

// ************************* Server Start *****************************

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`JWT authentication enabled`);
});

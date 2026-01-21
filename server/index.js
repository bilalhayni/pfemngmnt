const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

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
  }
});

// ************************* Registration *****************************

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
  const { filiere, firstName, lastName, phone, email, password, role, idPrerequisites } = req.body;

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "The Email already exists" });
    }

    db.query(
      "INSERT INTO users (email, password, firstName, lastName, idFiliere, phone, role, valid) VALUES (?, ?, ?, ?, ?, ?, ?, 0)",
      [email, password, firstName, lastName, filiere, phone, role],
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

        req.session.user = user;
        res.cookie("filId", user.idFiliere);
        res.cookie("userId", user.id);
        res.cookie("auth", true);
        res.cookie("role", user.role);

        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          idFiliere: user.idFiliere
        });
      } else {
        res.status(401).json({ message: "Wrong email/password combination!" });
      }
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

// ************************* Admin *****************************

// Create professor/chef departement account
app.post("/adminCreate", (req, res) => {
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

// ************************* Profile *****************************

// Get profile info
app.get("/profile/:id", (req, res) => {
  const id = req.params.id;

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
app.get("/profileStd/:id", (req, res) => {
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
app.put("/updateProfile", (req, res) => {
  const { id, fil, firstName, lastName, email, phone, password } = req.body;

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

// ************************* Professors *****************************

// Get professors by filiere (for chef departement)
app.get("/prof/:id", (req, res) => {
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

// Get all professors (for admin)
app.get("/allProf", (req, res) => {
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
app.get("/allChefDep", (req, res) => {
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

// ************************* Students *****************************

// Get students by filiere (activated)
app.get("/stdListe/:id", (req, res) => {
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

// Get pending students (for admin)
app.get("/stdListe", (req, res) => {
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
app.get("/stdListeAct", (req, res) => {
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

// Activate student account
app.put("/validStd", (req, res) => {
  const { id } = req.body;

  db.query("UPDATE users SET valid = 1 WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Activation failed" });
    }
    res.json({ message: "Student activated" });
  });
});

// Delete user (reject activation)
app.delete("/deleteUser/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Delete failed" });
    }
    res.json({ message: "User deleted" });
  });
});

// ************************* Prerequisites & Domains *****************************

// Get prerequisites by filiere
app.get("/prerequisFil/:id", (req, res) => {
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
app.get("/domaineFil/:id", (req, res) => {
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

// Add new domain
app.post("/addDomaine", (req, res) => {
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

// Add new prerequisite
app.post("/addPrerequi", (req, res) => {
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

// Add new filiere
app.post("/addFiliere", (req, res) => {
  const { name } = req.body;

  db.query("INSERT INTO filiere (name) VALUES (?)", [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Creation failed" });
    }
    res.status(201).json({ message: "Filiere created", id: result.insertId });
  });
});

// ************************* PFE Management *****************************

// Create new PFE
app.post("/newPfe", (req, res) => {
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
app.get("/myPfe/:id", (req, res) => {
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
app.get("/allPfe/:id", (req, res) => {
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
app.get("/allPfeStd/:id", (req, res) => {
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
app.get("/SinglePfe/:id", (req, res) => {
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
app.get("/prerequisPfe/:id", (req, res) => {
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
app.put("/updatePfe", (req, res) => {
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
app.put("/updateavan", (req, res) => {
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
app.put("/updateDateSout", (req, res) => {
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
app.delete("/deletePfe/:id", (req, res) => {
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
app.post("/addDemande", (req, res) => {
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
app.get("/demandes/:id", (req, res) => {
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
app.get("/stdPfe/:id", (req, res) => {
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
app.get("/pfeOfStd/:idUser", (req, res) => {
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
app.get("/MypfeOfStd/:idUser", (req, res) => {
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
app.put("/affectPfe", (req, res) => {
  const { id } = req.body;

  db.query("UPDATE demandes SET dispo = 1 WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Assignment failed" });
    }
    res.json({ message: "Student assigned to PFE" });
  });
});

// Delete demande
app.delete("/deleteDemande/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM demandes WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Delete failed" });
    }
    res.json({ message: "Demande deleted" });
  });
});

// ************************* Statistics *****************************

// Get professor count by filiere (for admin charts)
app.get("/profChart", (req, res) => {
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
app.get("/chefDepadv/:id", (req, res) => {
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
app.get("/chefDepadvAll/:id", (req, res) => {
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
app.get("/numProfChedDep/:id", (req, res) => {
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
app.get("/numStdChedDep/:id", (req, res) => {
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
app.get("/numPfeProf/:idUser", (req, res) => {
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
app.get("/numPfe/:id", (req, res) => {
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
app.get("/numDomaines/:id", (req, res) => {
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
app.get("/numProf", (req, res) => {
  db.query("SELECT COUNT(*) as num FROM users WHERE role = 0", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result[0]);
  });
});

// Count all chefs de departement (for admin)
app.get("/numChefDep", (req, res) => {
  db.query("SELECT COUNT(*) as num FROM users WHERE role = 1", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result[0]);
  });
});

// Count all students (for admin)
app.get("/numStd", (req, res) => {
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

// Dashboard stats endpoint
app.get("/stats/dashboard/:filiereId", (req, res) => {
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

// ************************* Password Reset *****************************

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
});

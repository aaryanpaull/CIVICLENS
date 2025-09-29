const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize SQLite database
const dbPath = path.join(__dirname, 'government.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create departments table
      db.run(`
        CREATE TABLE IF NOT EXISTS departments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          display_name TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create reports table
      db.run(`
        CREATE TABLE IF NOT EXISTS reports (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          photo_url TEXT,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          locality TEXT NOT NULL,
          description TEXT NOT NULL,
          ai_category TEXT NOT NULL,
          ai_summary TEXT,
          ai_severity_score REAL,
          ai_urgency_level TEXT,
          status TEXT DEFAULT 'RECEIVED',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          resolved_by TEXT,
          resolved_at DATETIME,
          reopen_count INTEGER DEFAULT 0
        )
      `);

      // Create admin table
      db.run(`
        CREATE TABLE IF NOT EXISTS admins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

// Seed departments data
async function seedDepartments() {
  const departments = [
    {
      name: 'Roads',
      email: 'roads@gccdemo.in',
      password: 'Roads2024!',
      display_name: 'Roads Department',
      description: 'Road maintenance, potholes, and infrastructure'
    },
    {
      name: 'Waste Management',
      email: 'waste@gccdemo.in',
      password: 'Waste2024!',
      display_name: 'Waste Management Department',
      description: 'Garbage collection, waste disposal, and sanitation'
    },
    {
      name: 'Infrastructure',
      email: 'infrastructure@gccdemo.in',
      password: 'Infra2024!',
      display_name: 'Infrastructure Department',
      description: 'Public infrastructure maintenance and development'
    },
    {
      name: 'Street Lighting',
      email: 'lighting@gccdemo.in',
      password: 'Light2024!',
      display_name: 'Street Lighting Department',
      description: 'Street lights, public lighting, and electrical infrastructure'
    },
    {
      name: 'Water and Sewage',
      email: 'water@gccdemo.in',
      password: 'Water2024!',
      display_name: 'Water and Sewage Department',
      description: 'Water supply, sewage systems, and drainage'
    },
    {
      name: 'Enforcement',
      email: 'enforcement@gccdemo.in',
      password: 'Enforce2024!',
      display_name: 'Enforcement Department',
      description: 'Political issues, vandalism, and law enforcement'
    },
    {
      name: 'Public Health & Sanitation',
      email: 'health@gccdemo.in',
      password: 'Health2024!',
      display_name: 'Public Health & Sanitation Department',
      description: 'Public health, sanitation, and hygiene'
    },
    {
      name: 'Parks & Green Spaces',
      email: 'parks@gccdemo.in',
      password: 'Parks2024!',
      display_name: 'Parks & Green Spaces Department',
      description: 'Parks, gardens, and green space maintenance'
    },
    {
      name: 'Planning',
      email: 'planning@gccdemo.in',
      password: 'Plan2024!',
      display_name: 'Planning Department',
      description: 'Encroachments, illegal constructions, and urban planning'
    },
    {
      name: 'Environmental',
      email: 'pollution@gccdemo.in',
      password: 'Pollute2024!',
      display_name: 'Environmental Department',
      description: 'Noise control, air pollution, and environmental issues'
    },
    {
      name: 'Drainage',
      email: 'drainage@gccdemo.in',
      password: 'Drain2024!',
      display_name: 'Drainage Department',
      description: 'Flooding, drainage systems, and water management'
    },
    {
      name: 'Traffic',
      email: 'traffic@gccdemo.in',
      password: 'Traffic2024!',
      display_name: 'Traffic Department',
      description: 'Traffic management, parking, and road safety'
    },
    {
      name: 'Electricity',
      email: 'electricity@gccdemo.in',
      password: 'Power2024!',
      display_name: 'Electricity Department',
      description: 'Power supply, electrical infrastructure, and outages'
    },
    {
      name: 'Public Transport',
      email: 'transport@gccdemo.in',
      password: 'Transport2024!',
      display_name: 'Public Transport Department',
      description: 'Public transport, bus stops, and transit infrastructure'
    },
    {
      name: 'Water Quality',
      email: 'drinkingwater@gccdemo.in',
      password: 'Drink2024!',
      display_name: 'Water Quality Department',
      description: 'Drinking water quality, testing, and supply'
    }
  ];

  for (const dept of departments) {
    const hashedPassword = await bcrypt.hash(dept.password, 10);
    
    db.run(
      `INSERT OR REPLACE INTO departments (name, email, password, display_name, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [dept.name, dept.email, hashedPassword, dept.display_name, dept.description],
      (err) => {
        if (err) {
          console.error('Error seeding department:', dept.name, err);
        } else {
          console.log(`Seeded department: ${dept.name}`);
        }
      }
    );
  }
}

// Seed admin
async function seedAdmin() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  db.run(
    `INSERT OR REPLACE INTO admins (email, password) VALUES (?, ?)`,
    ['admin@gccdemo.in', adminPassword],
    (err) => {
      if (err) {
        console.error('Error seeding admin:', err);
      } else {
        console.log('Seeded admin user');
      }
    }
  );
}

// Load sample reports
function loadSampleReports() {
  const seedPath = path.resolve(__dirname, '..', 'seed', 'sample_reports.json');
  try {
    const reports = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    
    reports.forEach(report => {
      db.run(
        `INSERT OR REPLACE INTO reports (
          id, user_id, photo_url, latitude, longitude, locality, description,
          ai_category, ai_summary, ai_severity_score, ai_urgency_level,
          status, created_at, updated_at, resolved_by, resolved_at, reopen_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          report.id, report.user_id, report.photo_url, report.latitude,
          report.longitude, report.locality, report.description,
          report.ai_category, report.ai_summary, report.ai_severity_score,
          report.ai_urgency_level, report.status, report.created_at,
          report.updated_at, report.resolved_by, report.resolved_at,
          report.reopen_count || 0
        ],
        (err) => {
          if (err) {
            console.error('Error loading report:', report.id, err);
          }
        }
      );
    });
    
    console.log(`Loaded ${reports.length} sample reports`);
  } catch (e) {
    console.error('Failed to load sample reports:', e);
  }
}

// Department mapping for category to department
const CATEGORY_TO_DEPARTMENT = {
  'Pothole': 'Roads',
  'Lighting': 'Street Lighting',
  'Obstruction': 'Infrastructure',
  'Sanitation': 'Waste Management',
  'Safety': 'Infrastructure',
  'Water': 'Water and Sewage',
  'Infrastructure': 'Infrastructure',
  'Vandalism': 'Enforcement',
  'Traffic': 'Traffic',
  'Parks': 'Parks & Green Spaces',
  'Planning': 'Planning',
  'Noise': 'Environmental',
  'Drainage': 'Drainage',
  'Electricity': 'Electricity',
  'Transport': 'Public Transport',
  'Water Quality': 'Water Quality',
  'Health': 'Public Health & Sanitation'
};

function getDepartmentFromCategory(category) {
  return CATEGORY_TO_DEPARTMENT[category] || 'Infrastructure';
}

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Health check
app.get('/healthz', (req, res) => res.json({ ok: true }));

// Department login
app.post('/auth/department', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  db.get(
    'SELECT * FROM departments WHERE email = ?',
    [email],
    async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await bcrypt.compare(password, row.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { 
          id: row.id, 
          email: row.email, 
          department: row.name,
          type: 'department'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        token,
        department: {
          id: row.id,
          name: row.name,
          email: row.email,
          displayName: row.display_name,
          description: row.description
        }
      });
    }
  );
});

// Admin login
app.post('/auth/admin', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  db.get(
    'SELECT * FROM admins WHERE email = ?',
    [email],
    async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await bcrypt.compare(password, row.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { 
          id: row.id, 
          email: row.email,
          type: 'admin'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        token,
        admin: {
          id: row.id,
          email: row.email
        }
      });
    }
  );
});

// Verify token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// Get department reports
app.get('/reports/department', verifyToken, (req, res) => {
  if (req.user.type !== 'department') {
    return res.status(403).json({ error: 'Department access required' });
  }
  
  const departmentName = req.user.department;
  
  db.all(
    `SELECT * FROM reports WHERE ai_category IN (
      SELECT ai_category FROM reports 
      WHERE ai_category IN (
        SELECT DISTINCT ai_category FROM reports
      )
    )`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Filter reports based on department
      const filteredReports = rows.filter(report => {
        const reportDepartment = getDepartmentFromCategory(report.ai_category);
        return reportDepartment === departmentName;
      });
      
      res.json(filteredReports);
    }
  );
});

// Get all reports (admin only)
app.get('/reports', verifyToken, (req, res) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  db.all('SELECT * FROM reports ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get specific report
app.get('/reports/:id', verifyToken, (req, res) => {
  const reportId = req.params.id;
  
  db.get('SELECT * FROM reports WHERE id = ?', [reportId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Check if user has access to this report
    if (req.user.type === 'department') {
      const reportDepartment = getDepartmentFromCategory(row.ai_category);
      if (reportDepartment !== req.user.department) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    res.json(row);
  });
});

// Update report status (admin only)
app.put('/reports/:id/status', verifyToken, (req, res) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const reportId = req.params.id;
  const { status, resolved_by } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  const updateData = {
    status,
    resolved_by: resolved_by || null,
    updated_at: new Date().toISOString()
  };
  
  if (status === 'RESOLVED') {
    updateData.resolved_at = new Date().toISOString();
  }
  
  db.run(
    `UPDATE reports SET status = ?, resolved_by = ?, resolved_at = ?, updated_at = ? WHERE id = ?`,
    [updateData.status, updateData.resolved_by, updateData.resolved_at, updateData.updated_at, reportId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      
      // Get updated report
      db.get('SELECT * FROM reports WHERE id = ?', [reportId], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(row);
      });
    }
  );
});

// Get departments list
app.get('/departments', (req, res) => {
  db.all('SELECT id, name, email, display_name, description FROM departments', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    await seedDepartments();
    await seedAdmin();
    loadSampleReports();
    
    app.listen(PORT, () => {
      console.log(`Government Portal Backend running on http://localhost:${PORT}`);
      console.log(`Database initialized at: ${dbPath}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
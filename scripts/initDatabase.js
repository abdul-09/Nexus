// scripts/initDatabase.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create or open database
const dbPath = path.join(dbDir, 'ict_nexus.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL'); // Enable Write-Ahead Logging for better performance

console.log('Connected to SQLite database');

try {
    // Create tables
    console.log('Creating tables...');
    
    // Tickets table
    db.exec(`CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        status TEXT NOT NULL,
        department TEXT,
        staff_id TEXT,
        staff_name TEXT,
        email TEXT,
        created_at DATETIME,
        updated_at DATETIME,
        resolved_at DATETIME
    )`);
    console.log('✓ Tickets table created successfully');

    // Assets table
    db.exec(`CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset_id TEXT UNIQUE NOT NULL,
        asset_type TEXT NOT NULL,
        asset_tag TEXT NOT NULL,
        serial_number TEXT,
        assigned_to TEXT,
        staff_id TEXT,
        department TEXT,
        status TEXT NOT NULL,
        created_at DATETIME,
        updated_at DATETIME
    )`);
    console.log('✓ Assets table created successfully');

    // Knowledge base table
    db.exec(`CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        keywords TEXT,
        views INTEGER DEFAULT 0,
        helpful_count INTEGER DEFAULT 0,
        created_at DATETIME,
        updated_at DATETIME
    )`);
    console.log('✓ Knowledge base table created successfully');

    // Insert mock data
    console.log('\nInserting mock data...');
    
    // Prepare insert statements
    const insertTicket = db.prepare(`INSERT OR IGNORE INTO tickets 
        (ticket_id, title, description, category, priority, status, department, staff_id, staff_name, email, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || abs(random() % 7) || ' days'))`);
    
    const insertAsset = db.prepare(`INSERT OR IGNORE INTO assets 
        (asset_id, asset_type, asset_tag, serial_number, assigned_to, staff_id, department, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || abs(random() % 30) || ' days'))`);
    
    const insertArticle = db.prepare(`INSERT OR IGNORE INTO knowledge_base 
        (article_id, title, category, content, keywords, views, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`);

    // Mock tickets
    const mockTickets = [
        {
            ticket_id: 'TKT001',
            title: 'Cannot login to Kwatos system',
            description: 'I forgot my password and cannot access the Kwatos container management system. This is urgent as I need to process shipments.',
            category: 'software',
            priority: 'high',
            status: 'open',
            department: 'Operations',
            staff_id: 'EMP1234',
            staff_name: 'John Kamau',
            email: 'j.kamau@kpa.co.ke'
        },
        {
            ticket_id: 'TKT002',
            title: 'Gate 12 Scanner Malfunction',
            description: 'The scanner at Gate 12 is not reading access cards properly. Staff are having to manually process entries.',
            category: 'hardware',
            priority: 'high',
            status: 'open',
            department: 'Security',
            staff_id: 'EMP5678',
            staff_name: 'Mary Wanjiru',
            email: 'm.wanjiru@kpa.co.ke'
        },
        {
            ticket_id: 'TKT003',
            title: 'Printer not working in HR office',
            description: 'The main printer in HR office is showing error lights and not printing documents.',
            category: 'hardware',
            priority: 'medium',
            status: 'resolved',
            department: 'Human Resources',
            staff_id: 'EMP9012',
            staff_name: 'Peter Ochieng',
            email: 'p.ochieng@kpa.co.ke'
        },
        {
            ticket_id: 'TKT004',
            title: 'Internet connection issues in Building C',
            description: 'Slow internet connection affecting productivity in the entire Building C.',
            category: 'network',
            priority: 'medium',
            status: 'open',
            department: 'Finance',
            staff_id: 'EMP3456',
            staff_name: 'Grace Mutua',
            email: 'g.mutua@kpa.co.ke'
        },
        {
            ticket_id: 'TKT005',
            title: 'Request for new access card',
            description: 'Lost my access card and need a replacement to enter restricted areas.',
            category: 'access',
            priority: 'medium',
            status: 'resolved',
            department: 'Engineering',
            staff_id: 'EMP7890',
            staff_name: 'David Kiplagat',
            email: 'd.kiplagat@kpa.co.ke'
        }
    ];

    // Insert tickets
    mockTickets.forEach(ticket => {
        try {
            insertTicket.run([
                ticket.ticket_id,
                ticket.title,
                ticket.description,
                ticket.category,
                ticket.priority,
                ticket.status,
                ticket.department,
                ticket.staff_id,
                ticket.staff_name,
                ticket.email
            ]);
        } catch (err) {
            if (!err.message.includes('UNIQUE constraint failed')) {
                console.error(`Error inserting ticket ${ticket.ticket_id}:`, err.message);
            }
        }
    });
    console.log('✓ Tickets inserted');

    // Mock assets
    const mockAssets = [
        {
            asset_id: 'AST001',
            asset_type: 'Laptop',
            asset_tag: 'KPA-LT-2023-001',
            serial_number: 'HP1234567890',
            assigned_to: 'John Kamau',
            staff_id: 'EMP1234',
            department: 'Operations',
            status: 'active'
        },
        {
            asset_id: 'AST002',
            asset_type: 'Printer',
            asset_tag: 'KPA-PR-2023-015',
            serial_number: 'CN234567890',
            assigned_to: 'HR Department',
            staff_id: 'DEPT-HR',
            department: 'Human Resources',
            status: 'active'
        },
        {
            asset_id: 'AST003',
            asset_type: 'Radio',
            asset_tag: 'KPA-RD-2023-045',
            serial_number: 'MOT567890123',
            assigned_to: 'Mary Wanjiru',
            staff_id: 'EMP5678',
            department: 'Security',
            status: 'active'
        },
        {
            asset_id: 'AST004',
            asset_type: 'Access Card',
            asset_tag: 'KPA-AC-2023-234',
            serial_number: 'AC000234',
            assigned_to: 'Peter Ochieng',
            staff_id: 'EMP9012',
            department: 'Human Resources',
            status: 'active'
        },
        {
            asset_id: 'AST005',
            asset_type: 'Scanner',
            asset_tag: 'KPA-SC-2023-012',
            serial_number: 'ZB345678901',
            assigned_to: 'Gate 12',
            staff_id: 'LOC-GT12',
            department: 'Security',
            status: 'maintenance'
        }
    ];

    // Insert assets
    mockAssets.forEach(asset => {
        try {
            insertAsset.run([
                asset.asset_id,
                asset.asset_type,
                asset.asset_tag,
                asset.serial_number,
                asset.assigned_to,
                asset.staff_id,
                asset.department,
                asset.status
            ]);
        } catch (err) {
            if (!err.message.includes('UNIQUE constraint failed')) {
                console.error(`Error inserting asset ${asset.asset_id}:`, err.message);
            }
        }
    });
    console.log('✓ Assets inserted');

    // Mock knowledge base articles
    const mockArticles = [
        {
            article_id: 'KB001',
            title: 'How to Reset Your Kwatos Password',
            category: 'Kwatos',
            content: `Follow these steps to reset your Kwatos password:
1. Go to the Kwatos login page
2. Click on "Forgot Password?" link
3. Enter your employee email address
4. Check your email for the reset link
5. Click the link and create a new password
6. Password must be at least 8 characters with numbers and special characters

If you don't receive the email within 5 minutes, contact ICT support.`,
            keywords: 'kwatos,password,reset,login,forgot'
        },
        {
            article_id: 'KB002',
            title: 'Printer Troubleshooting Guide',
            category: 'Hardware',
            content: `Common printer issues and solutions:
1. Paper Jam: Open all compartments and remove stuck paper
2. Error Lights: Turn off printer, wait 30 seconds, turn on
3. Not Printing: Check cable connections and printer queue
4. Poor Quality: Replace toner/ink cartridge
5. Network Issues: Restart printer and check IP settings

For persistent issues, log a ticket with ICT support.`,
            keywords: 'printer,troubleshoot,paper,jam,error,toner'
        },
        {
            article_id: 'KB003',
            title: 'Requesting New Access Cards',
            category: 'Access Control',
            content: `To request a new access card:
1. Fill out Form ICT-AC-01 from the portal
2. Get approval from your department head
3. Submit to ICT office with valid ID
4. Card will be ready within 24 hours
5. Collect from ICT office with receipt

Lost cards must be reported immediately to Security.`,
            keywords: 'access,card,request,new,lost,security'
        },
        {
            article_id: 'KB004',
            title: 'Container Error 404 in Kwatos',
            category: 'Kwatos',
            content: `When you encounter Container 404 error:
1. This means the container record is missing
2. Check if container number is correct
3. Verify container has been registered in system
4. Try refreshing the page (F5)
5. Clear browser cache if error persists

Contact Operations team if container should exist.`,
            keywords: 'kwatos,container,404,error,missing'
        },
        {
            article_id: 'KB005',
            title: 'WiFi Connection Setup Guide',
            category: 'Network',
            content: `To connect to KPA WiFi:
1. Network Name: KPA-Staff
2. Security: WPA2-Enterprise
3. Username: Your employee ID
4. Password: Your email password
5. Certificate: Accept when prompted

For guests, use KPA-Guest network with daily password from reception.`,
            keywords: 'wifi,network,internet,connection,setup'
        }
    ];

    // Insert articles
    mockArticles.forEach(article => {
        const views = Math.floor(Math.random() * 100);
        try {
            insertArticle.run([
                article.article_id,
                article.title,
                article.category,
                article.content,
                article.keywords,
                views
            ]);
        } catch (err) {
            if (!err.message.includes('UNIQUE constraint failed')) {
                console.error(`Error inserting article ${article.article_id}:`, err.message);
            }
        }
    });
    console.log('✓ Knowledge base articles inserted');

    // Count records for verification
    const ticketCount = db.prepare('SELECT COUNT(*) as count FROM tickets').get();
    const assetCount = db.prepare('SELECT COUNT(*) as count FROM assets').get();
    const articleCount = db.prepare('SELECT COUNT(*) as count FROM knowledge_base').get();

    console.log('\n✓ Database initialization complete!');
    console.log('✓ Records inserted:');
    console.log(`  - Tickets: ${ticketCount.count}`);
    console.log(`  - Assets: ${assetCount.count}`);
    console.log(`  - Knowledge Base Articles: ${articleCount.count}`);
    console.log(`✓ Database location: ${dbPath}`);

} catch (err) {
    console.error('❌ Error during database initialization:', err);
    process.exit(1);
} finally {
    // Close the database connection
    db.close();
    console.log('Database connection closed.');
}
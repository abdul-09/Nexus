# KPA ICT Nexus - Internal Support & Asset Portal

A Next.js-based tool designed to streamline ICT support operations at Kenya Ports Authority (KPA). This unified web portal automates Level 1 administrative support tasks, allowing senior engineers to focus on complex technical issues.

## 🌟 Key Features

### 1. Smart Ticket Triage (AI Component)
- **Automatic Categorization**: Keywords-based system that scans ticket descriptions and automatically assigns categories (Software, Hardware, Network, Access)
- **Priority Detection**: Identifies urgent issues based on keywords like "urgent", "critical", "down"
- **Real-time Preview**: Shows categorization predictions as users type their descriptions

### 2. Self-Service Knowledge Base
- **Searchable FAQ System**: Specifically designed for KPA systems like Kwatos
- **Popular Articles**: Tracks and displays most-viewed articles
- **Category Filtering**: Quick access to articles by category
- **Helpful Voting**: Users can mark articles as helpful

### 3. ICT Asset Tracker
- **Comprehensive Database**: Tracks laptops, radios, gate access cards, and other equipment
- **Staff Assignment**: Links assets to specific staff members and departments
- **Status Tracking**: Monitor active, maintenance, and retired assets
- **Search & Filter**: Quick asset lookup by tag, serial number, or assigned staff

### 4. Administrative Reports
- **PDF Generation**: One-click weekly report generation
- **Visual Analytics**: Charts showing ticket distribution, priority levels, and trends
- **KPI Dashboard**: Track response times, resolution rates, and user satisfaction
- **Export Options**: CSV export for further analysis

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
```bash
cd kpa-ict-nexus
```

2. **Install dependencies:**
```bash
npm install
```

3. **Initialize the database with mock data:**
```bash
npm run init-db
```

This will create a SQLite database at `database/ict_nexus.db` with sample tickets, assets, and knowledge base articles.

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser and navigate to:**
```
http://localhost:3000
```

## 📁 Project Structure

```
kpa-ict-nexus/
├── app/                       # Next.js App Router
│   ├── api/                   # API Routes
│   │   ├── tickets/          # Ticket management API
│   │   ├── assets/           # Asset management API
│   │   ├── knowledge-base/   # Knowledge base API
│   │   ├── stats/            # Statistics API
│   │   └── weekly-report/    # PDF report generation
│   ├── assets/               # Assets management page
│   ├── knowledge-base/       # Knowledge base page
│   ├── reports/              # Reports and analytics page
│   ├── submit-ticket/        # Ticket submission page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Dashboard (home page)
│   └── globals.css           # Global styles
├── components/                # Reusable React components
│   ├── Navbar.tsx            # Navigation bar
│   ├── Footer.tsx            # Footer component
│   └── Charts.tsx            # Chart components (Chart.js)
├── lib/                       # Utility libraries
│   └── db.ts                 # Database helper functions
├── scripts/                   # Utility scripts
│   └── initDatabase.js       # Database initialization
├── database/                  # SQLite database files
│   └── ict_nexus.db          # Main database (created by init script)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── README.md                 # This file
```

## 💻 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite (easily portable, no server required)
- **Styling**: Custom CSS with CSS variables
- **Charts**: Chart.js with react-chartjs-2
- **PDF Generation**: Puppeteer for report generation
- **State Management**: React Hooks (useState, useEffect)

## 🎯 Features by Page

### Dashboard (`/`)
- Welcome section with quick action cards
- Real-time statistics (open tickets, resolved today, active assets)
- Interactive charts showing ticket distribution and trends
- Quick navigation to all major sections

### Submit Ticket (`/submit-ticket`)
- Smart form with real-time categorization
- Auto-detection of priority based on keywords
- Department selection
- Instant feedback on submission
- Helpful tips sidebar

### Assets (`/assets`)
- Complete asset listing with search and filters
- Add new assets via modal form
- Asset types: Laptops, Printers, Radios, Scanners, Access Cards
- Status tracking (Active, Maintenance, Retired)
- Department-wise asset allocation

### Knowledge Base (`/knowledge-base`)
- Searchable article database
- Category filtering (Kwatos, Hardware, Network, Access Control)
- Expandable articles with full content
- Most viewed articles sidebar
- Emergency contact information

### Reports (`/reports`)
- Executive summary with key metrics
- Visual charts (Pie and Bar charts)
- Detailed statistics table
- PDF report generation
- CSV export functionality
- KPI dashboard with trends

## 🔧 API Endpoints

### Tickets
- `GET /api/tickets` - Fetch all tickets
- `POST /api/tickets` - Create a new ticket

### Assets
- `GET /api/assets` - Fetch all assets
- `POST /api/assets` - Add a new asset

### Knowledge Base
- `GET /api/knowledge-base` - Fetch all articles

### Statistics
- `GET /api/stats` - Get comprehensive statistics

### Reports
- `GET /api/weekly-report` - Generate and download PDF report

## 🗄️ Database Schema

### Tickets Table
- ticket_id, title, description, category, priority, status
- department, staff_id, staff_name, email
- created_at, updated_at, resolved_at

### Assets Table
- asset_id, asset_type, asset_tag, serial_number
- assigned_to, staff_id, department, status
- created_at, updated_at

### Knowledge Base Table
- article_id, title, category, content, keywords
- views, helpful_count
- created_at, updated_at

## 🌐 Smart Categorization

The system uses keyword-based categorization:

**Categories:**
- **Software**: kwatos, login, password, system, error, crash
- **Hardware**: printer, scanner, computer, laptop, mouse, keyboard
- **Network**: internet, wifi, connection, network, lan, ethernet
- **Access**: gate, card, badge, access, entry, permission

**Priority Levels:**
- **High**: urgent, critical, down, emergency
- **Low**: minor, low, whenever
- **Medium**: Default for everything else

## 📊 Mock Data

The system comes pre-loaded with realistic mock data:
- 5 sample tickets with various categories and priorities
- 5 ICT assets assigned to different departments
- 5 knowledge base articles for common issues
- Simulated user data from different KPA departments

## 🔄 Development Workflow

### Development Mode
```bash
npm run dev
```
Starts the Next.js development server with hot reloading at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Reinitialize Database
```bash
npm run init-db
```
**Warning**: This will reset all data to the initial mock data.

## 🎨 Customization

### Adding New Ticket Categories
Edit [`lib/db.ts`](lib/db.ts):
```typescript
const keywords = {
  software: ['kwatos', 'login', 'password'],
  hardware: ['printer', 'scanner'],
  // Add your new category here
  newCategory: ['keyword1', 'keyword2']
}
```

### Modifying Asset Types
Edit [`app/assets/page.tsx`](app/assets/page.tsx):
```typescript
const assetTypes = [
  'Laptop', 'Printer',
  // Add new asset types here
  'New Asset Type'
]
```

### Adding Knowledge Base Articles
Use the database directly or create an admin interface to add articles:
```sql
INSERT INTO knowledge_base (article_id, title, category, content, keywords, created_at)
VALUES ('KB006', 'New Article', 'Category', 'Content...', 'keywords', datetime('now'));
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```


**Built by Abdulaziz Hussein**

For questions or support, contact: ICT Department - Nexus

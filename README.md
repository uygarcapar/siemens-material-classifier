# Siemens Material Classifier

A modern web application for classifying materials using the Siemens Industrial Experience (IX) design system.

## Features

- **Classify Materials**: Select a project and classify materials as Class A, B, C, or D with an intuitive interface
- **View Classifications**: Browse classification data in a powerful AG Grid table with filtering and Excel export
- **Recent Projects**: Quick access to recently selected projects
- **Responsive Design**: Fully optimized for desktop and mobile devices with slide-out navigation
- **Multi-language Support**: English and Turkish language support with instant switching
- **URL Parameters**: Shareable links with project pre-selection
- **Local Storage**: Classification data persists across sessions

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Siemens IX v3** - Design system and components
- **AG Grid React** - Advanced data grid
- **React Router DOM** - Client-side routing
- **react-i18next** - Internationalization
- **ExcelJS** - Excel export functionality

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd siemens-material-classifier
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
siemens-material-classifier/
├── src/
│   ├── assets/              # Static assets (images, icons)
│   ├── components/          # Reusable React components
│   │   ├── ProjectSelectorSearch.jsx
│   │   └── ProjectSelectorWithLatest.jsx
│   ├── data/
│   │   └── mockData.js      # Mock data for development
│   ├── hooks/
│   │   └── useUrlProjectParam.js  # URL parameter hook
│   ├── i18n/
│   │   ├── i18n.js          # i18n configuration
│   │   └── locales/
│   │       ├── en.json      # English translations
│   │       └── tr.json      # Turkish translations
│   ├── pages/
│   │   ├── ClassifyMaterials.jsx
│   │   └── ViewClassifications.jsx
│   ├── utils/
│   │   └── classificationStorage.js  # LocalStorage utilities
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles and theme
├── index.html
├── package.json
└── vite.config.js
```

## Usage

### Navigation

The app has two main pages accessible via the left menu:

1. **Classify Materials** - Classify materials for selected projects
2. **View Classifications** - View and export classification results

### Classify Materials Page

- Select a project from recent projects or search by project number
- Classify each material using the color-coded buttons (Class A/B/C/D)
- Track progress with the pending count indicator
- Submit all classifications at once
- Classifications are saved to localStorage

### View Classifications Page

- Select a project to view its classification data
- Use AG Grid features:
  - Sort columns
  - Filter data using set filters
  - View color-coded classifications
- Export data to Excel with styling preserved

### URL Parameters

Share direct links to projects:
- `/classifymaterials?project=7048011111`
- `/viewclassifications?project=7048022222`

### Language Switching

Toggle between English and Turkish using the language selector in the bottom menu.

## Classification Color Coding

| Class   | Color  | Description |
|---------|--------|-------------|
| Class A | Green  | High priority |
| Class B | Blue   | Standard |
| Class C | Orange | Medium priority |
| Class D | Red    | Low priority |

## Data Storage

- Classifications are stored in browser localStorage
- Data persists across sessions
- Recent project selections are tracked
- Export to Excel for external use

## Development

### Key Technologies

- **Siemens IX Components**: IxButton, IxMenu, IxMenuItem, IxSelect, IxPill, IxIcon, IxTypography, IxModal
- **Custom Theme**: Dark theme with Siemens brand colors
- **Responsive Design**: Mobile-first with 768px breakpoint
- **AG Grid**: Advanced filtering, sorting, and Excel export

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- LocalStorage support required

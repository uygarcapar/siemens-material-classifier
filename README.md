# Siemens Material Classifier

A web application for classifying materials using Siemens Industrial Experience (IX) design system.

## Features

- **Classify Materials** (`/classifymaterials`): Select a project and classify materials as Class A, B, C, or D
- **View Classifications** (`/viewclassifications`): View classification data in an AG Grid table with filtering and Excel export
- **i18n Support**: English and Turkish language support
- **URL Parameters**: Project selection syncs with URL for bookmarkable links

## Tech Stack

- React 18
- Vite
- Siemens IX v3 (Design System)
- AG Grid React
- react-i18next
- ExcelJS
- React Router DOM

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Handle Version Compatibility (if needed)

If you encounter version compatibility errors between AG Grid and Siemens IX, modify `package-lock.json` as mentioned in the assignment.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   └── ProjectSelector.jsx    # Reusable project selection component
├── pages/
│   ├── ClassifyMaterials.jsx  # Material classification page
│   └── ViewClassifications.jsx # Classification viewing page with AG Grid
├── data/
│   └── mockData.js            # Mock data for projects and classifications
├── i18n/
│   ├── i18n.js                # i18n configuration
│   └── locales/
│       ├── en.json            # English translations
│       └── tr.json            # Turkish translations
├── hooks/
│   └── useUrlProjectParam.js  # URL parameter management hook
├── App.jsx                    # Main app with routing and IX layout
├── main.jsx                   # Entry point
└── index.css                  # Global styles
```

## URL Parameters

Both pages support URL parameter handling:

- `/classifymaterials?project=7048011111` - Opens with project pre-selected
- `/viewclassifications?project=7048022222` - Opens with project pre-selected

## Features Details

### Classify Materials Page

- Select from latest projects or search by project number
- Table-based classification UI
- Visual feedback with color-coded class buttons
- Progress indicator showing classified/pending materials
- Confirmation modal before submission
- Success modal after classification

### View Classifications Page

- Search and select project
- AG Grid table with dynamic height
- Column filtering using set filters
- Color-coded classification cells
- Excel export with ExcelJS (styled output)

### Internationalization

- Language toggle in the left menu (bottom)
- Supports English (en) and Turkish (tr)
- All UI text is translatable

## Class Color Coding

| Class   | Color  | Usage |
|---------|--------|-------|
| Class A | Green  | Success/High priority |
| Class B | Blue   | Info/Standard |
| Class C | Orange | Warning/Medium priority |
| Class D | Red    | Alarm/Low priority |

## Notes

- This application uses mock data. In production, connect to your backend API.
- AG Grid is configured with `ag-theme-alpine-dark` for Siemens IX compatibility.
- The table height adjusts dynamically to available page space.

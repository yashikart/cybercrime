# Cybercrime Investigation Dashboard

Professional dashboard built with React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library

## Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Setup shadcn/ui

```bash
# Install shadcn/ui CLI (if not already installed)
npx shadcn-ui@latest init

# Add components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
# etc.
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Figma Integration

1. Use **Figma Dev Mode** to inspect design specs
2. Use **Figma to React** plugins for component export
3. Match colors/spacing using Tailwind config
4. Use shadcn/ui components as base and customize to match Figma

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   │   └── ui/        # shadcn/ui components (auto-generated)
│   ├── lib/           # Utilities
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── components.json    # shadcn/ui config
├── tailwind.config.js # Tailwind configuration
└── vite.config.ts    # Vite configuration
```

## Notes

- This is a **Node.js project**, not Python
- Dependencies are managed with **npm** (not pip/venv)
- Python venv is only for backend (if you have one)

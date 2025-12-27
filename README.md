# 📊 FinBoard: Customizable Finance Dashboard

FinBoard is a powerful, real-time finance monitoring dashboard built with **Next.js 14**. It allows users to connect to any financial API, explore JSON responses dynamically, and build a personalized monitoring suite with customizable widgets.

## ✨ Features

- **🚀 Dynamic API Integration**: Connect to any REST API (Alpha Vantage, CoinGecko, Binance, etc.).
- **🔍 JSON Explorer**: Interactive field selection—no more guessing JSON paths.
- **📈 Advanced Visualization**: 
    - **Finance Cards**: Single-metric monitoring with custom formatting.
    - **Tables**: Searchable, sortable, and paginated data grids.
    - **Charts**: Responsive Area and Line charts with dynamic time-range switching (`24H`, `7D`, `30D`).
- **🔗 Real-time Data**: Support for WebSocket streams (e.g., Binance Live Ticker) with automatic fallback.
- **🎛️ Dashboard Builder**: 
    - **Drag-and-Drop**: Pixel-perfect layout control.
    - **Live Editing**: Change URLs, intervals, and formats on the fly.
    - **Templates**: Instant starter layouts for Crypto and Stocks.
- **🌓 Modern UI/UX**: 
    - Beautiful **Dark/Light** mode.
    - Glassmorphism design aesthetics.
    - Skeleton loaders and error boundaries for a robust experience.
- **💾 Data Persistence**: Full dashboard state saved to local storage. Import/Export support for configuration backups.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server-side Rendering)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **Layout Engine**: [DND Kit](https://dndkit.com/) / [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/finboard.git
   cd finboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage Guide

### Using Custom Formatting
When adding or editing a widget, you can now select a **Value Format**:
- **1,234**: Standard number formatting.
- **$1,234**: Automatically adds USD currency formatting.
- **12%**: Formats values as percentages.
- **Abc**: Raw text display.

### Drag-and-Drop
Click the **Grip** icon on any widget header to move it. Use the **Settings** menu to expand widget width or height to fit your data.

### templates
Don't know where to start? Use the **Dashboard Settings** (Layout icon) to load a template like the "Crypto Market Starter".

---

## 📁 Project Structure

- `src/app`: Application routing and global providers.
- `src/components/dashboard`: Core dashboard layout and widget wrapping logic.
- `src/components/widgets`: Individual components for Cards, Tables, and Charts.
- `src/hooks`: Custom hooks for data fetching and web sockets.
- `src/lib`: Logic for API fetching, JSON flattening, and value formatting.
- `src/store`: Global state management for dashboard configuration.
- `src/types`: TypeScript definitions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for the Advanced Agentic Coding Challenge.**

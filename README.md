
# antd-ai-models-manager  
UI for AI Models Management

## Local start
```bash
npm i
npm run dev
```
**Note:** When running locally or in production, you need to set the following environment variables:
```
VITE_PORT=3333
VITE_FLAI_URL=http://localhost:4010 # url to flai core
```

## Build
```bash
npm run build
```

This project provides a user interface for managing AI models, built with Ant Design for styling and a streamlined development workflow using Vite.

---

### **Project Description**  
`antd-ai-models-manager` is a web-based tool for managing AI models. It allows users to add, update, and monitor AI models seamlessly. The application leverages the Ant Design UI library for a clean and responsive interface, and Vite for fast builds and HMR during development.

### **Dependencies Overview**  
- **React 18** – Core UI library  
- **Ant Design 5** – UI components  
- **React Router DOM 7** – Client-side routing  
- **TanStack React Query 5** – Data fetching and caching  
- **Zod 3** – Data validation  
- **Tailwind CSS 3** – Utility-first CSS framework

### **Development Tools**  
- **Vite 6** – Build tool and dev server  
- **TypeScript 5.6** – Static typing  
- **ESLint 9** – Code linting with React and TypeScript support  
- **PostCSS & Autoprefixer** – CSS processing and compatibility

---

### **Scripts**  
- `npm run dev` – Starts local dev server with HMR  
- `npm run build` – Builds the project using TypeScript and Vite  
- `npm run preview` – Runs a local preview server for the build  
- `npm run lint` – Runs ESLint for code quality checks  
- `npm run lint:fix` – Runs ESLint with auto-fixing enabled

---

### **Setup Instructions**  
Clone the repository, install dependencies, and set up the `.env` file with the required environment variables for local or production use. The app supports multiple environments, just comment/uncomment the relevant `VITE_FLAI_URL`.

---

### **Potential Improvements**  
- Add Docker support for containerized deployment  
- Implement Role-Based Access Control (RBAC)  
- Integrate AI model versioning and rollback features  
- Improve test coverage with unit and integration tests  
- Add WebSocket support for real-time status updates

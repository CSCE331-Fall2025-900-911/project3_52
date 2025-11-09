# MomTea POS (Point of Sale System)

## Overview

MomTea POS is a full-stack Point of Sale web application designed for efficient and seamless retail operations. This project leverages modern technologies including React, TypeScript, Express, and TailwindCSS to deliver a responsive and scalable solution.

---

## 🌐 **Live Demo:** [Link](https://momtea-pos.shop)

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd pos-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```
---
## Development

To start the development server with hot-reloading:

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Build

To create a production-ready build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

---

## Testing

Run the test suite in interactive watch mode:

```bash
npm test
```

---

## Environment Setup

- Ensure you have Node.js (v18 or higher recommended) and npm installed.
- Configure environment variables in `.env`:

  ```
  REACT_APP_API_BASE=<your-backend-api-base-url>
  ```

  This variable is used to connect the frontend to the backend API.

---

## Tech Stack

- **React** 19
- **TypeScript**
- **TailwindCSS** 3
- **Stripe & PayPal SDKs** for payment integration
- **React Hot Toast** for notifications

---

## Folder Structure

```
/src
    /api         # API service utilities
    /components  # Reusable UI components
    /contexts    # Context providers (AuthContext, LangContext)
    /pages       # Page-level components
    /types       # TypeScript type definitions
```

---

## Developer Notes

- **Customization:** Modify components in `/src/components` and pages in `/src/pages` to tailor the UI and functionality.
- **API Integration:** Update API endpoints in `/src/api/configure.ts` according to your backend implementation.
- **Styling:** Use TailwindCSS utility classes for rapid UI development and customization.
- **Deployment:** The production build in `build/` can be served using any static file server or integrated with your backend server.
- **Ejecting:** If you need to customize the build configuration, you can eject using `npm run eject`, but note this is irreversible.

For more detailed documentation, refer to the official docs of the respective technologies used in this project.

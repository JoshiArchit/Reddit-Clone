# Tech Stack
- React
  - Dependencies - package.json
  - Other dependencies - npm i --save-dev @types/node @clerk/backend svix react-router-dom react-icons

- Convex - https://www.convex.dev/
  - Summary : Backend reactive db solution that lives in project file.
  - Documentation - https://docs.convex.dev/quickstart/react
  - Start off :
  `npm install convex`
  `npx convex dev`
    

- Authentication - Clerk
  - Docs : https://docs.convex.dev/auth/clerk
  - Steps
    - Create JWT template with Convex
    - Get the issuer
    - Install clerk 
      `npm install @clerk/clerk-react`
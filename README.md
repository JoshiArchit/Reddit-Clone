# Tech Stack
- React
  - Dependencies - package.json
  - Other dependencies - npm i --save-dev @types/node @clerk/backend svix react-router-dom react-icons

- Convex - https://www.convex.dev/
  - Summary : Backend reactive db solution that lives in project file.
  - Documentation - https://docs.convex.dev/quickstart/react
  - Start off :
  `npm install convex`
    - Generates the api.d.ts file which is dynamic. Can be put in .gitignore.
  `npx convex dev`
  - Sharded counter-
    `npm install @convex-dev/sharded-counter`
    - https://www.convex.dev/components/sharded-counter
    

- Authentication - Clerk
  - Docs : https://docs.convex.dev/auth/clerk
  - Steps
    - Create JWT template with Convex
    - Get the issuer
    - Install clerk 
      `npm install @clerk/clerk-react`
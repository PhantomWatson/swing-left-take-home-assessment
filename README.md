# SL/VF Technical Take Home - Graham Watson

### Installation
1. `npm install --no-save`
1. `cp .env.template .env.local` and update the values as needed
1. `npm run db:create-db`
1. `npm run dev`
1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Running Tests
1. Install any [dependencies needed by Cypress](https://on.cypress.io/required-dependencies)
1. If the dev server isn't already running, run `npm run dev` 
1. Run `npm run test` (in a separate terminal window, if needed)
1. Once the Cypress opens, select E2E tests, then click "Start E2E Testing in Electron"
1. Select `api.cy.ts` to run the API test 

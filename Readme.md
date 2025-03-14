# Ticketing Microservices Application

This repository contains a microservices-based ticketing application built using various technologies and adhering to best practices for scalable and maintainable systems.

## Tech Stack

- **Node.js**: JavaScript runtime for server-side applications.
- **Express**: Web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM library for MongoDB in Node.js.
- **JWT (jsonwebtoken)**: Library for generating and verifying JSON Web Tokens.
- **NATS Streaming**: Messaging system for event-driven communication.
- **Docker**: Containerization platform.
- **Kubernetes**: Container orchestration system.
- **Next.js**: React framework for building server-rendered and static applications.
- **Jest**: JavaScript testing framework.
- **Supertest**: Library for testing HTTP servers.
- **express-validator**: Middleware for validating request data.

## Edge Cases and Challenges

1. **Type Incompatibilities**

- Resolved type mismatches between different versions of `express` and its types by standardizing dependency versions.
- Updated `package.json` files and reinstalled dependencies for consistency.

2. **Environment Variables**

- Ensured environment variables like `JWT_KEY` are defined and accessible.
- Utilized `dotenv` to manage environment variables in development and testing.

3. **Database Management**

- Employed `MongoMemoryServer` for an in-memory MongoDB during tests to avoid external database dependencies.
- Implemented setup and teardown logic to manage database state between tests.

4. **Authentication and Authorization**

- Integrated JWT-based authentication for secure user login and registration.
- Protected routes with middleware to allow only authenticated users to access certain endpoints.

5. **Event-Driven Architecture**

- Leveraged NATS Streaming for event publishing and subscribing, enabling decoupled microservices communication.
- Created event publishers and listeners for handling ticket creation and updates.

6. **Containerization and Orchestration**

- Used Docker to containerize each microservice to ensure consistent deployments.
- Deployed services using Kubernetes for scalability and reliability.

7. **Testing**

- Wrote unit and integration tests using Jest and Supertest.
- Achieved comprehensive test coverage across critical parts of the application.

## Course Reference

This project follows the [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/) course by Stephen Grider on Udemy.

## Getting Started

### Prerequisites

## NPM Registry Setup for Common Module

1. Create an NPM registry for the common module:

- In your common module directory, update the package.json to use the desired scope:
  - Set the "name" to "@tickets-com/common".
- Publish the common module to your NPM registry:
  ```sh
  npm login
  npm publish --access public
  ```
- If using a private registry, configure your .npmrc accordingly.

2. Update Import Paths:

- Search and replace all relative imports of the common module in your microservices.
- For example, change:
  ```js
  import { someUtility } from "../common";
  ```
  to:
  ```js
  import { someUtility } from "@tickets-com/common";
  ```
- Ensure that all microservice projects are updated to correctly reference the package from the NPM registry.

- Docker
- Kubernetes
- Node.js
- npm or yarn

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/ticketing.git
cd ticketing
```

2. Install dependencies for each microservice:

```sh
cd auth
npm install
cd ../client
npm install
cd ../common
npm install
cd ../nats-test
npm install
cd ../orders
npm install
cd ../tickets
npm install
```

3. Set up environment variables:

- Create a `.env` file in each microservice directory and add the required environment variables.

4. Start the application using Docker and Kubernetes:

```sh
skaffold dev
```

### Running Tests

To run the tests for each microservice, navigate to the respective directory and run:

```sh
npm test
```

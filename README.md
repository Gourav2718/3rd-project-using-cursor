# Guardians of Maharashtra: A Map of Historic Forts

This is a Next.js application that showcases the historic forts of Maharashtra, India. The application includes authentication features and integrates with MongoDB Atlas for data storage.

## Features

- User authentication (signup, login, logout)
- Responsive design for all device sizes
- MongoDB Atlas integration for data persistence
- Overview of historic forts in Maharashtra

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd guardians-of-maharashtra
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://demo123:demo123@cluster0.c4fnq.mongodb.net/forts_database?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-secret-key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and helpers
- `/src/models` - Mongoose models for MongoDB
- `/src/middleware.ts` - Route protection middleware

## Authentication Flow

1. User signs up with name, email, phone number, and password
2. Password is hashed using bcryptjs before storing in the database
3. On successful signup/login, a JWT token is generated and stored in cookies
4. Protected routes check for the presence of this token
5. User can log out, which clears the token from cookies

## License

This project is licensed under the MIT License.

## Acknowledgments

- The Next.js team for the amazing framework
- MongoDB Atlas for the database service
- Tailwind CSS for the utility-first CSS framework

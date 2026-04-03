# FinFlow

FinFlow is a secure backend system for processing financial data with role-based access control. It provides features for:

- **User Authentication**: Secure user registration and login with role-based access control.
- **Financial Record Management**: Create, update, and manage income and expense records. Filtering records based on criteria such as date, category, and type.
- **Dashboard Summaries**: Fetch financial summaries, including total income, expenses, net balance, category-wise totals, and recent activity.
- **Role-Based Authorization**: Ensure only authorized users can access specific resources.
- **Validation and Error Handling**: Comprehensive validation for user inputs and financial records. Input validation, useful error responses, and status codes used appropriately.

---

## Project Structure

```
server.js               # Entry point for the application
src/
├── app.js               # Main application setup
├── config/
│   └── database.js      # MongoDB connection setup
├── controllers/
│   ├── authController.js       # Handles user authentication
│   ├── dashboardController.js  # Provides dashboard summaries
│   └── recordController.js     # Manages financial records
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── authorize.js     # Role-based authorization middleware
├── models/
│   ├── Record.js        # Record schema
│   └── User.js          # User schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── dashboard.js     # Dashboard routes
│   └── records.js       # Record management routes
└── services/
    └── statsService.js  # Business logic for financial summaries
```

---

## Setup Instructions

### Prerequisites

- **Node.js**
- **MongoDB**
- A `.env` file with the following variables:
  ```
  PORT=3000
  MONGO_URI=<Your MongoDB Connection String>
  JWT_SECRET=<Your JWT Secret>
  ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd FinFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   node server.js
   ```

4. **Access the backend system**:
   The backend system will be available at `http://localhost:3000`.

---

## API Endpoints

### Authentication

- **POST** `/api/auth/register`: Register a new user.
  - **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "securepassword",
      "role": "Analyst"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "user": {
        "id": "69ce85c47d5c8",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "Analyst",
        "status": "active"
      }
    }
    ```

- **POST** `/api/auth/login`: Log in an existing user.
  - **Request Body**:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securepassword"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "User logged in successfully",
      "user": {
        "id": "69ce85c47d5c8",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "Analyst"
      }
    }
    ```

- **PATCH** `/api/auth/manage-user/:userId`: Update user status (Admin only).
  - **Request Body**:
    ```json
    {
      "status": "inactive",
      "role": "Viewer"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "User account updated successfully",
      "data": {
        "id": "69ce85c47d5c8",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "Viewer",
        "status": "inactive"
      }
    }
    ```

### Records

- **GET** `/api/records`: Fetch all records for the authenticated user.
 
  - **Response**:
    ```json
    {
      "success": true,
      "count": 2,
      "message": "Records fetched successfully",
      "data": [
        {
          "id": "69cf2f4bf6ac985",
          "amount": 5000,
          "type": "income",
          "category": "Salary",
          "description": "Monthly salary",
          "date": "2026-04-01T10:15:30.456Z",
          "belongsTo": {
            "name": "John Doe"
          },
          "createdBy": {
            "name": "Admin User"
          }
        },
        {
          "id": "69ce98c9d4051a0",
          "amount": 2000,
          "type": "income",
          "category": "Freelance",
          "description": "Freelance project",
          "date": "2026-04-01T10:15:30.456Z",
          "belongsTo": {
            "name": "John Doe"
          },
          "createdBy": {
            "name": "Admin User"
          }
        }
      ]
    }
    ```

- **POST** `/api/records/add`: Add a new financial record.
  - **Request Body**:
    ```json
    {
      "amount": 1000,
      "type": "expense",
      "category": "Groceries",
      "description": "Weekly groceries",
      "belongsTo": "69mnopq901rst"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Record created successfully",
      "data": {
        "id": "69cf3a7ff6ac9856",
        "amount": 1000,
        "type": "expense",
        "category": "Groceries",
        "description": "Weekly groceries",
        "date": "2026-04-01T10:15:30.456Z",
        "belongsTo": "69uvwxy234zab",
        "createdBy": "69fghij456uvw"
      }
    }
    ```

- **PATCH** `/api/records/:id`: Update a financial record.
  - **Request Body**:
    ```json
    {
      "amount": 1200,
      "type": "expense",
      "category": "Groceries",
      "description": "Updated groceries"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Record updated successfully",
      "data": {
        "id": "69cf3a7ff6ac9",
        "amount": 1200,
        "type": "expense",
        "category": "Groceries",
        "description": "Updated groceries",
        "date": "2026-04-01T10:15:30.456Z",
        "belongsTo": "69abcde123xyz",
        "createdBy": "69fghij456uvw",
        "createdAt": "2026-03-01T10:30:00.000Z",
        "updatedAt": "2026-03-16T14:45:00.000Z"
      }
    }
    ```

- **DELETE** `/api/records/:id`: Delete a financial record.
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Record deleted successfully"
    }
    ```

### Dashboard

- **GET** `/api/dashboard/summary`: Fetch financial summaries for the authenticated user.
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Dashboard summary fetched successfully",
      "data": {
        "summary": {
          "totalIncome": 5000,
          "totalExpense": 2000,
          "netBalance": 3000
        },
        "categoryWise": [
          {
            "_id": "Project",
            "totalAmount": 5000,
            "type": "income"
          },
          {
            "_id": "Travel",
            "totalAmount": 2000,
            "type": "expense"
          }
        ],
        "recentActivity": [
          {
            "_id": "69ce98c9af273",
            "amount": 2000,
            "type": "expense",
            "category": "Travel",
            "date": "2026-04-02T16:26:49.123Z",
            "description": "summer vacation trip",
            "belongsTo": {
              "_id": "69ce85c478641d",
              "name": "adminTest"
            },
            "createdBy": {
              "_id": "69ce85c448641d",
              "name": "adminTest"
            },
            "createdAt": "2026-04-02T16:26:49.125Z",
            "updatedAt": "2026-04-02T16:26:49.125Z",
          },
          {
            "_id": "69ce9899d6eaf271",
            "amount": 5000,
            "type": "income",
            "category": "Project",
            "date": "2026-04-02T16:26:01.393Z",
            "description": "Freelance web development project",
            "belongsTo": {
              "_id": "69ce85c4148641d",
              "name": "adminTest"
            },
            "createdBy": {
              "_id": "69ce85cf1148641d",
              "name": "adminTest"
            },
            "createdAt": "2026-04-02T16:26:01.395Z",
            "updatedAt": "2026-04-02T16:26:01.395Z",
          }
        ]
      }
    }
    ```

---

## Tech Stack

The project is built using the following technologies:

- **Backend Framework**: Express.js
- **Runtime Environment**: Node.js
- **Database**: MongoDB

### Dependencies

The project uses the following npm packages:

- **bcrypt**: For hashing passwords.
- **cookie-parser**: For parsing cookies.
- **cors**: For enabling Cross-Origin Resource Sharing.
- **dotenv**: For managing environment variables.
- **express**: For building the backend server.
- **jsonwebtoken**: For handling JSON Web Tokens.
- **mongoose**: For interacting with MongoDB.

---

## Assumptions

- Users are assigned one of three roles: `Admin`, `Analyst`, or `Viewer`.
- Type of financial record either `income` or `expense`.
- The `belongsTo` field in records links to the user who owns the record.

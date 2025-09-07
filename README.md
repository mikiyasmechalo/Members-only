# Odin Members Only App

![App Screenshot](/public/images/screenshot.png) 

A full-stack web application built as part of The Odin Project's curriculum, demonstrating user authentication, membership features, and basic CRUD operations (Create, Read, Update, Delete) for messages.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Membership & Admin Features](#membership--admin-features)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- **User Authentication:** Secure sign-up, sign-in, and logout functionality using Passport.js with a local strategy.
- **Password Hashing:** Passwords are securely stored using bcrypt.
- **Session Management:** User sessions are managed with `express-session` and a persistent store.
- **Message Board:** Users can create, view, and manage messages.
- **Membership Status:** Differentiates content display and access based on user membership status.
- **Admin Functionality:**
  - Secure admin sign-up with an `ADMIN_SIGNUP_KEY`.
  - Admin users can delete any message.
- **Form Validation:** Client-side validation using `express-validator` to ensure data integrity and a good user experience.
- **Database Integration:** PostgreSQL database for storing user and message data.
- **Dynamic Views:** EJS templating engine for rendering dynamic HTML content.
- **Responsive Design:** Styled with Tailwind CSS for a modern and responsive user interface.

## Technologies Used

-   **Backend:**
    -   Node.js
    -   Express.js
    -   PostgreSQL (`pg` for database interaction)
    -   Passport.js (Local Strategy for authentication)
    -   `express-session` (Session management)
    -   `bcryptjs` (Password hashing)
    -   `dotenv` (Environment variable management)
    -   `express-validator` (Form validation)
-   **Frontend:**
    -   EJS (Templating engine)
    -   Tailwind CSS (Utility-first CSS framework)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (LTS version recommended)
-   npm (Node Package Manager, comes with Node.js)
-   PostgreSQL (database server)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/odin-members-only.git](https://github.com/your-username/odin-members-only.git)
    cd odin-members-only
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Database Setup

1.  **Create a PostgreSQL database:**
    ```sql
    CREATE DATABASE odin_members_only;
    ```
    (You might need to adjust the database name in your `pool.js` if it's different).

2.  **Create tables:**
    Connect to your new database and run the following SQL commands to create the `users` and `message` tables:

    ```sql
    -- Create 'users' table
    CREATE TABLE users (
        id serial primary key,
        first_name varchar(50) not null,
        last_name varchar(50),
        username varchar(50) UNIQUE, -- Ensure username is unique
        hashed_password text,
        membership_status BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE -- New admin field
    );

    -- Create 'message' table
    CREATE TABLE message (
        id serial primary key,
        title varchar(255), -- Added title column
        text text not null,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id integer,
        foreign key (user_id) references users(id) ON DELETE CASCADE
    );
    ```
    _Note: `ON DELETE CASCADE` on the foreign key means that if a user is deleted, all their associated messages will also be deleted._

### Environment Variables

Create a `.env` file in the root directory of your project and add the following variables:

```dotenv
# Database connection string
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/odin_members_only"

# Express session secret (should be a long, random string)
SESSION_SECRET="a_very_secret_key_for_express_session"

# Secret key for admin user registration (make this very strong and keep it private!)
ADMIN_SIGNUP_KEY="a_super_secret_key_for_admin_signup"

# Optional: Port for your server
PORT=3000
````

Remember to replace `your_username`, `your_password`, and the secret keys with your actual credentials and strong, random values.

### Usage

To run the server in development mode (with `nodemon` for auto-reloading):

```bash
npm start
```

The application will be accessible at `http://localhost:3000` (or your specified PORT).

## Project Structure

```
.
├── public/                       # Static assets (CSS, images, JS for client)
│   └── stylesheets/
│       └── style.css             # Custom CSS for global styles
├── routes/
│   ├── auth.js                   # Authentication routes (sign-up, sign-in, logout, admin-signup)
│   └── index.js                  # Main application routes (home, create-post, delete-message, club-pass)
├── views/                        # EJS template files
│   ├── index.ejs
│   ├── newpost.ejs
│   ├── sign-in.ejs
│   ├── sign-up.ejs
│   ├── sign-up-admin.ejs
│   └── clubpass.ejs
├── db/
│   └── pool.js                   # PostgreSQL database connection pool setup
├── app.js                        # Main Express application file
├── package.json
├── package-lock.json
├── .env                          # Environment variables (IGNORED BY GIT)
└── README.md
```

## Authentication

The application uses Passport.js for robust user authentication:

  - **Local Strategy:** Authenticates users against the `users` table in the PostgreSQL database.
  - **Session Management:** `express-session` stores user sessions, and `passport.serializeUser`/`passport.deserializeUser` handle saving user data to and retrieving it from the session.

## Membership & Admin Features

  - **Membership Status:** Users can join the "club" by entering a specific password (`/password` route), which updates their `membership_status` in the database. Members gain access to additional message details (e.g., author's username, exact timestamp).
  - **Admin Users:** A separate `/sign-up-admin` route allows for the creation of administrator accounts, protected by a private `ADMIN_SIGNUP_KEY`. Admin users have elevated privileges, such as being able to delete any message.

## Styling

Tailwind CSS is used to style the application. The Tailwind CDN is included directly in the EJS templates for simplicity in this project. A `public/stylesheets/style.css` file is also used for minimal global styles and resets.

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

## License

This project is open-source and available under the [MIT License](https://opensource.org/license/mit). 

## Acknowledgements

  - [The Odin Project](https://www.theodinproject.com/) for providing the curriculum and inspiration.
  - [Express.js](https://expressjs.com/)
  - [Passport.js](http://www.passportjs.org/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [Tailwind CSS](https://tailwindcss.com/)

<!-- end list -->

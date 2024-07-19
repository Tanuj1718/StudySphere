                                    # LEARNING CONTENT SHARING PLATFORM

## Overview

This platform allows users to register, login, and share their best learning content with others. Users can create posts that include a title, content, and a link. The main goal is to provide a space where everyone can access valuable learning resources.

## Tech Stack
### Frontend
React: A JavaScript library for building user interfaces.

Vite: A fast frontend build tool and development server.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

### Backend
Go (Golang): The backend of the application is built with Go, a statically typed, compiled programming language designed for efficiency and reliability.

MongoDB: A NoSQL database used to store user information and posts.

### Backend Details
Go (Golang)

The backend server is implemented in Go, leveraging its performance and concurrency capabilities to handle user authentication and post management.

### Key components include:

Gorilla Mux: A powerful HTTP router and URL matcher for Go.

JWT (JSON Web Tokens): Used for securing routes and ensuring only authenticated users can create and view posts.

MongoDB Driver: The official MongoDB driver for Go, used for database operations.

CORS Handling

The backend includes CORS middleware to allow secure cross-origin requests from the frontend.

## Setup and Installation
**Clone the repository:**

                            git clone https://github.com/yourusername/learning-content-sharing-platform.git
                            cd learning-content-sharing-platform
**Frontend:**

Navigate to the frontend directory:

                            cd frontend
Install dependencies and start the development server:

                            npm install
                            npm run dev
**Backend:**

Navigate to the backend directory:
                            cd backend
Install dependencies:

                            go mod tidy
Start the server:

                            go run main.go

## Usage
Registration: Users can register by providing a username and password.

Login: Users can log in using their registered credentials.

Create Post: Logged-in users can create posts with a title, content, and link.

View Posts: Users can view posts shared by others.

## API Endpoints
POST "/api/register": Register a new user.

POST "/api/login": Login and receive a JWT token.

POST "/api/posts": Create a new post (requires JWT).

GET "/api/posts": Get all posts (requires JWT).

**Contributing**

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
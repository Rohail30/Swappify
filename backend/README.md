| Method | Endpoint                        | Description           | Request Parameters | Request Body                          |
|--------|---------------------------------|-----------------------|--------------------|---------------------------------------|
| POST   | /api/auth/login                 | Login a user          | N/A                | `email`, `password`                   |
| POST   | /api/auth/register              | Register a new user   | N/A                | `name`, `email`, `password`, `mobile` |
| GET    | /api/auth/verify/:userId/:token | Verify user email     | `userId`, `token`  | N/A                                   |
| GET    | /api/users                      | Retrieve all users    | N/A                | N/A                                   |
| GET    | /api/users/:id                  | Retrieve a user by ID | `userId`           | N/A                                   |
| PUT    | /api/users/:id                  | Update a user by ID   | `userId`           | `name`, `email`, `password`, `mobile` |

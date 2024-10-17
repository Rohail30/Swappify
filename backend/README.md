| Method | Endpoint                        | Description           | Request Parameters | Request Body                          |
|--------|---------------------------------|-----------------------|--------------------|---------------------------------------|
| POST   | /api/auth/login                 | Login a user          | N/A                | `email`, `password`                   |
| POST   | /api/auth/register              | Register a new user   | N/A                | `name`, `email`, `password`, `mobile` |
| GET    | /api/auth/verify/:userId/:token | Verify user email     | `userId`, `token`  | N/A                                   |
| GET    | /api/users                      | Retrieve all users    | N/A                | N/A                                   |
| GET    | /api/users/:id                  | Retrieve a user by ID | `userId`           | N/A                                   |
| PUT    | /api/users/:id                  | Update a user by ID   | `userId`           | `name`, `email`, `password`, `mobile` |
| POST   | /api/items/add                  | Add a new item        | N/A                | `image`, `name`, `description`, `owner`, `condition`, `category`, `location`, `priceMin`, `priceMax` |
| PUT    | /api/items/update/:id           | Update an item by ID  | `itemId`           | `image`, `name`, `description`, `owner`, `condition`, `category`, `location`, `priceMin`, `priceMax` |
| DELETE | /api/items/delete/:id           | Delete an item by ID  | `itemId`           | N/A                                   |
| GET    | /api/items                      | Retrieve all items    | N/A                | N/A                                   |
| GET    | /api/items/:id                  | Retrieve an item by ID| `itemId`           | N/A                                   |
| GET    | /api/items/user/:id             | Retrieve items by user| `userId`           | N/A                                   |
| GET    | /api/items/search/:query        | Search items by query | `query`            | N/A                                   |
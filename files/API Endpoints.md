| Entity        | Endpoint                 | Description                                                    |
| ------------- | ------------------------ | -------------------------------------------------------------- |
| Users         | `/users`                 | CRUD users                                                     |
| Auth          | `/auth/login`            | Simulate login (handled locally)                               |
| Projects      | `/projects`              | CRUD projects                                                  |
| Categories    | `/categories`            | CRUD task categories                                           |
| Todos         | `/todos`                 | CRUD todos, supports filters `?userId=&completed=&categoryId=` |
| Comments      | `/comments?todoId=`      | Related to specific todos                                      |
| Attachments   | `/attachments?todoId=`   | File metadata per todo                                         |
| Activity Logs | `/activityLogs`          | Audit actions                                                  |
| Notifications | `/notifications?userId=` | Personal notifications feed                                    |

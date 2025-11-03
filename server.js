import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// 🧩 Simulate authentication
server.post('/login', (req, res) => {
  const { email } = req.body;
  const user = router.db.get('users').find({ email }).value();
  if (user) {
    res.jsonp({
      token: `fake-jwt-${user.id}`,
      user
    });
  } else {
    res.status(401).jsonp({ message: 'Invalid credentials' });
  }
});

// 🧩 Advanced filtering for todos
server.get('/todos', (req, res) => {
  let todos = router.db.get('todos').value();

  const { completed, priority, categoryId, userId, q } = req.query;

  if (completed !== undefined)
    todos = todos.filter(t => String(t.completed) === completed);
  if (priority)
    todos = todos.filter(t => t.priority === priority);
  if (categoryId)
    todos = todos.filter(t => Number(t.categoryId) === Number(categoryId));
  if (userId)
    todos = todos.filter(t => Number(t.userId) === Number(userId));
  if (q)
    todos = todos.filter(t => t.title.toLowerCase().includes(q.toLowerCase()));

  // Expand category and user info
  todos = todos.map(t => ({
    ...t,
    category: router.db.get('categories').find({ id: t.categoryId }).value(),
    user: router.db.get('users').find({ id: t.userId }).value()
  }));

  res.jsonp(todos);
});

// Default router
server.use(router);

server.listen(3000, () => {
  console.log('🚀 Enhanced Fake API running at http://localhost:3000');
});

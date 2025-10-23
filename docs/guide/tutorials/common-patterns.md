# Common Patterns

Learn the most common patterns and best practices for building Rinari applications.

## Table of Contents

1. [Model Relationships](#model-relationships)
2. [Data Validation](#data-validation)
3. [Default Values & Timestamps](#default-values--timestamps)
4. [Soft Deletes](#soft-deletes)
5. [Pagination](#pagination)
6. [Search & Filtering](#search--filtering)
7. [Caching](#caching)
8. [Error Handling](#error-handling)

---

## Model Relationships

Rinari doesn't have built-in foreign keys, but you can simulate relationships using IDs and helper functions.

### One-to-Many (e.g., Author → Posts)

```javascript
const Author = orm.define('default', 'authors', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true },
});

const Post = orm.define('default', 'posts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  authorId: { type: DataTypes.INTEGER, notNull: true },
  title: { type: DataTypes.TEXT, notNull: true },
  content: { type: DataTypes.TEXT, notNull: true },
});

Post.createIndex('idx_author_posts', { columns: ['authorId'] });

function getAuthorWithPosts(authorId) {
  const author = Author.findById(authorId);
  if (!author) return null;

  const posts = Post.findAll({
    where: { authorId },
    orderBy: [['createdAt', 'DESC']],
  });

  return { author, posts };
}
```

### Many-to-Many (e.g., Posts ↔ Tags)

Use a junction table:

```javascript
const Post = orm.define('default', 'posts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.TEXT, notNull: true },
});

const Tag = orm.define('default', 'tags', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, notNull: true, unique: true },
});

const PostTag = orm.define('default', 'post_tags', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.INTEGER, notNull: true },
  tagId: { type: DataTypes.INTEGER, notNull: true },
});

PostTag.createIndex('idx_post_tags', { columns: ['postId', 'tagId'] });

function addTagToPost(postId, tagId) {
  PostTag.create({ postId, tagId });
}

function getPostWithTags(postId) {
  const post = Post.findById(postId);
  if (!post) return null;

  const postTags = PostTag.findAll({ where: { postId } });
  const tags = postTags.map(pt => Tag.findById(pt.tagId));

  return { post, tags };
}
```

---

## Data Validation

Validate data before creating or updating records:

```javascript
function createUser(username, email, age) {
  if (!username || username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }

  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }

  if (age && (age < 13 || age > 120)) {
    throw new Error('Age must be between 13 and 120');
  }

  const existing = User.findOne({ where: { email } });
  if (existing) {
    throw new Error('Email already exists');
  }

  return User.create({
    username,
    email,
    age,
    createdAt: new Date().toISOString(),
  });
}
```

---

## Default Values & Timestamps

Always include timestamps for tracking:

```javascript
const User = orm.define('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  status: { type: DataTypes.TEXT, default: 'active' },
  createdAt: { type: DataTypes.DATETIME, notNull: true },
  updatedAt: { type: DataTypes.DATETIME, notNull: true },
});

function createUser(username) {
  const now = new Date().toISOString();
  return User.create({
    username,
    createdAt: now,
    updatedAt: now,
  });
}

function updateUser(id, data) {
  return User.update(
    { ...data, updatedAt: new Date().toISOString() },
    { id }
  );
}
```

---

## Soft Deletes

Instead of deleting records, mark them as deleted:

```javascript
const Post = orm.define('default', 'posts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.TEXT, notNull: true },
  deletedAt: { type: DataTypes.DATETIME },
});

function softDelete(id) {
  return Post.update(
    { deletedAt: new Date().toISOString() },
    { id }
  );
}

function getActivePosts() {
  const all = Post.findAll();
  return all.filter(post => !post.deletedAt);
}

function getDeletedPosts() {
  const all = Post.findAll();
  return all.filter(post => post.deletedAt);
}

function restorePost(id) {
  return Post.update({ deletedAt: null }, { id });
}
```

---

## Pagination

Implement pagination for large datasets:

```javascript
function getPaginatedPosts(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const total = Post.count();
  const totalPages = Math.ceil(total / limit);

  const posts = Post.findAll({
    orderBy: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

const result = getPaginatedPosts(2, 20);
console.log(`Page ${result.pagination.page} of ${result.pagination.totalPages}`);
console.log(`Showing ${result.posts.length} of ${result.pagination.total} posts`);
```

---

## Search & Filtering

Combine multiple search criteria:

```javascript
function searchPosts(options = {}) {
  const { query, status, authorId, tags, sortBy = 'createdAt', order = 'DESC' } = options;

  let posts = Post.findAll();

  if (query) {
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (status) {
    posts = posts.filter(post => post.status === status);
  }

  if (authorId) {
    posts = posts.filter(post => post.authorId === authorId);
  }

  if (tags && tags.length > 0) {
    posts = posts.filter(post =>
      tags.some(tag => post.tags && post.tags.includes(tag))
    );
  }

  posts.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (order === 'ASC') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return posts;
}

const results = searchPosts({
  query: 'tutorial',
  status: 'published',
  tags: ['javascript', 'rinari'],
  sortBy: 'views',
  order: 'DESC',
});
```

---

## Caching

Cache frequently accessed data:

```javascript
const cache = new Map();
const CACHE_TTL = 60000;

function getCachedUser(id) {
  const cacheKey = `user:${id}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const user = User.findById(id);
  if (user) {
    cache.set(cacheKey, {
      data: user,
      timestamp: Date.now(),
    });
  }

  return user;
}

function invalidateUserCache(id) {
  cache.delete(`user:${id}`);
}

function updateUser(id, data) {
  const result = User.update(data, { id });
  invalidateUserCache(id);
  return result;
}
```

---

## Error Handling

Always handle errors gracefully:

```javascript
function safeCreateUser(username, email) {
  try {
    if (!username || !email) {
      return { success: false, error: 'Username and email are required' };
    }

    const existing = User.findOne({ where: { email } });
    if (existing) {
      return { success: false, error: 'Email already exists' };
    }

    const user = User.create({
      username,
      email,
      createdAt: new Date().toISOString(),
    });

    return { success: true, data: user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}

const result = safeCreateUser('alice', 'alice@example.com');
if (result.success) {
  console.log('User created:', result.data);
} else {
  console.error('Failed to create user:', result.error);
}
```

### Transaction Error Handling

```javascript
function transferCoins(fromUserId, toUserId, amount) {
  try {
    return User.transaction(() => {
      const fromUser = User.findById(fromUserId);
      const toUser = User.findById(toUserId);

      if (!fromUser || !toUser) {
        throw new Error('User not found');
      }

      if (fromUser.coins < amount) {
        throw new Error('Insufficient coins');
      }

      User.update({ coins: fromUser.coins - amount }, { id: fromUserId });
      User.update({ coins: toUser.coins + amount }, { id: toUserId });

      return { success: true };
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## Best Practices Summary

✅ **Use Indexes** - Create indexes on frequently queried fields  
✅ **Validate Input** - Always validate data before database operations  
✅ **Use Timestamps** - Track when records are created and updated  
✅ **Handle Errors** - Wrap operations in try-catch blocks  
✅ **Use Transactions** - For operations that must succeed or fail together  
✅ **Cache Wisely** - Cache frequently accessed, rarely changing data  
✅ **Paginate Results** - Don't load thousands of records at once  
✅ **Use Helper Functions** - Encapsulate common operations  

---

## Next Steps

- Check out the [Discord Bot example](https://github.com/OpenUwU/rinari/tree/main/examples/discord-notes-bot) to see these patterns in action
- Read about [Advanced Features](../core-concepts.md)
- Explore the [API Reference](https://github.com/OpenUwU/rinari/tree/main/docs/api)

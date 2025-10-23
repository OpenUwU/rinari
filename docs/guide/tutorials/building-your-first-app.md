# Building Your First Real App

In this tutorial, we'll build a **complete task management application** from scratch. You'll learn practical patterns and techniques you can use in your own projects.

## What We'll Build

A task management app with:
- Tasks with title, description, status, and priority
- Categories for organizing tasks
- Search and filter functionality
- Statistics dashboard
- Data persistence with SQLite

## Prerequisites

- Completed the [Quick Start Tutorial](./quick-start.md)
- Basic understanding of JavaScript
- Node.js 18+ installed

## Project Setup

Create a new project:

```bash
mkdir task-manager
cd task-manager
npm init -y
npm install @rinari/orm @rinari/sqlite
```

Update `package.json` to enable ES modules:

```json
{
  "type": "module"
}
```

## Step 1: Project Structure

Create this file structure:

```
task-manager/
├── src/
│   ├── models/
│   │   ├── task.js
│   │   └── category.js
│   ├── utils/
│   │   └── db.js
│   └── app.js
├── package.json
└── README.md
```

## Step 2: Database Setup

Create `src/utils/db.js`:

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';

export const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});

export function closeDatabase() {
  orm.disconnect();
  console.log('Database connection closed');
}
```

This file exports a configured ORM instance that other files can use.

## Step 3: Define the Category Model

Create `src/models/category.js`:

```javascript
import { DataTypes } from '@rinari/types';
import { orm } from '../utils/db.js';

export const Category = orm.define('default', 'categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  color: {
    type: DataTypes.TEXT,
    default: 'blue',
  },
  taskCount: {
    type: DataTypes.INTEGER,
    notNull: true,
    default: 0,
  },
  createdAt: {
    type: DataTypes.DATETIME,
    notNull: true,
  },
});

Category.createIndex('idx_category_name', { columns: ['name'] });

export function createCategory(name, color = 'blue') {
  return Category.create({
    name,
    color,
    taskCount: 0,
    createdAt: new Date().toISOString(),
  });
}

export function getAllCategories() {
  return Category.findAll({
    orderBy: [['name', 'ASC']],
  });
}

export function getCategoryByName(name) {
  return Category.findOne({ where: { name } });
}

export function incrementCategoryTaskCount(categoryName) {
  const category = Category.findOne({ where: { name: categoryName } });
  if (category) {
    Category.update(
      { taskCount: category.taskCount + 1 },
      { name: categoryName }
    );
  }
}

export function decrementCategoryTaskCount(categoryName) {
  const category = Category.findOne({ where: { name: categoryName } });
  if (category && category.taskCount > 0) {
    Category.update(
      { taskCount: category.taskCount - 1 },
      { name: categoryName }
    );
  }
}
```

## Step 4: Define the Task Model

Create `src/models/task.js`:

```javascript
import { DataTypes } from '@rinari/types';
import { orm } from '../utils/db.js';
import { incrementCategoryTaskCount, decrementCategoryTaskCount } from './category.js';

export const Task = orm.define('default', 'tasks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.TEXT,
    notNull: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.TEXT,
    notNull: true,
    default: 'pending',
  },
  priority: {
    type: DataTypes.TEXT,
    notNull: true,
    default: 'medium',
  },
  category: {
    type: DataTypes.TEXT,
  },
  dueDate: {
    type: DataTypes.DATETIME,
  },
  completedAt: {
    type: DataTypes.DATETIME,
  },
  createdAt: {
    type: DataTypes.DATETIME,
    notNull: true,
  },
  updatedAt: {
    type: DataTypes.DATETIME,
    notNull: true,
  },
});

Task.createIndex('idx_status', { columns: ['status'] });
Task.createIndex('idx_priority', { columns: ['priority'] });
Task.createIndex('idx_category', { columns: ['category'] });
Task.createIndex('idx_due_date', { columns: ['dueDate'] });

export function createTask(title, description, priority = 'medium', category = null, dueDate = null) {
  const now = new Date().toISOString();
  
  const task = Task.create({
    title,
    description,
    status: 'pending',
    priority,
    category,
    dueDate,
    createdAt: now,
    updatedAt: now,
  });

  if (category) {
    incrementCategoryTaskCount(category);
  }

  return task;
}

export function getAllTasks() {
  return Task.findAll({
    orderBy: [
      ['status', 'ASC'],
      ['priority', 'DESC'],
      ['dueDate', 'ASC'],
    ],
  });
}

export function getPendingTasks() {
  return Task.findAll({
    where: { status: 'pending' },
    orderBy: [
      ['priority', 'DESC'],
      ['dueDate', 'ASC'],
    ],
  });
}

export function getTasksByCategory(category) {
  return Task.findAll({
    where: { category },
    orderBy: [['createdAt', 'DESC']],
  });
}

export function searchTasks(query) {
  return Task.findAll({
    where: {
      title: { $like: `%${query}%` },
    },
  });
}

export function completeTask(id) {
  const task = Task.findById(id);
  if (!task) return null;

  Task.update(
    {
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { id }
  );

  return Task.findById(id);
}

export function deleteTask(id) {
  const task = Task.findById(id);
  if (!task) return false;

  if (task.category) {
    decrementCategoryTaskCount(task.category);
  }

  Task.delete({ id });
  return true;
}

export function getTaskStats() {
  const all = Task.findAll();
  const completed = all.filter(t => t.status === 'completed');
  const pending = all.filter(t => t.status === 'pending');
  const highPriority = pending.filter(t => t.priority === 'high');

  return {
    total: all.length,
    completed: completed.length,
    pending: pending.length,
    highPriority: highPriority.length,
  };
}
```

## Step 5: Build the Main Application

Create `src/app.js`:

```javascript
import {
  createTask,
  getAllTasks,
  getPendingTasks,
  searchTasks,
  completeTask,
  deleteTask,
  getTaskStats,
} from './models/task.js';
import {
  createCategory,
  getAllCategories,
  getCategoryByName,
} from './models/category.js';
import { closeDatabase } from './utils/db.js';

console.log('📋 Task Manager\n');

console.log('Creating categories...');
createCategory('Work', 'blue');
createCategory('Personal', 'green');
createCategory('Shopping', 'yellow');

const categories = getAllCategories();
console.log(`Created ${categories.length} categories:`, categories.map(c => c.name).join(', '));

console.log('\nCreating tasks...');
const task1 = createTask(
  'Finish project documentation',
  'Complete API docs and examples',
  'high',
  'Work',
  new Date(Date.now() + 86400000).toISOString()
);

const task2 = createTask(
  'Buy groceries',
  'Milk, bread, eggs, vegetables',
  'medium',
  'Shopping'
);

const task3 = createTask(
  'Exercise',
  '30 minutes cardio',
  'medium',
  'Personal'
);

const task4 = createTask(
  'Code review',
  'Review pull requests',
  'high',
  'Work',
  new Date(Date.now() + 3600000).toISOString()
);

const task5 = createTask(
  'Read book',
  'Continue reading JavaScript book',
  'low',
  'Personal'
);

console.log('Created 5 tasks');

console.log('\n📋 All Tasks:');
const allTasks = getAllTasks();
allTasks.forEach(task => {
  const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[task.priority];
  const statusEmoji = task.status === 'completed' ? '✅' : '⬜';
  console.log(`  ${statusEmoji} ${priorityEmoji} [${task.category || 'None'}] ${task.title}`);
});

console.log('\n⚡ Pending Tasks:');
const pendingTasks = getPendingTasks();
pendingTasks.forEach(task => {
  const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[task.priority];
  console.log(`  ${priorityEmoji} ${task.title}`);
});

console.log('\n🔍 Searching for "review"...');
const searchResults = searchTasks('review');
console.log(`Found ${searchResults.length} tasks:`, searchResults.map(t => t.title));

console.log('\n✅ Completing tasks...');
completeTask(task1.id);
completeTask(task2.id);
console.log('Completed 2 tasks');

console.log('\n📊 Task Statistics:');
const stats = getTaskStats();
console.log(`  Total: ${stats.total}`);
console.log(`  Completed: ${stats.completed}`);
console.log(`  Pending: ${stats.pending}`);
console.log(`  High Priority: ${stats.highPriority}`);

console.log('\n📂 Tasks by Category:');
categories.forEach(category => {
  console.log(`  ${category.name}: ${category.taskCount} tasks`);
});

console.log('\n🗑️  Deleting a task...');
deleteTask(task5.id);
console.log('Deleted 1 task');

const finalStats = getTaskStats();
console.log(`\n📊 Final Stats: ${finalStats.total} total, ${finalStats.completed} completed, ${finalStats.pending} pending`);

closeDatabase();
console.log('\n👋 Task Manager closed');
```

## Step 6: Run Your App

```bash
node src/app.js
```

You should see a complete task management session with categories, tasks, searches, and statistics!

## What You Have Learned

- **Project Structure** - Organizing code into models and utilities
- **Model Design** - Creating related models with helper functions
- **Database Indexes** - Optimizing queries with indexes
- **Helper Functions** - Building reusable operations
- **Relationships** - Simulating relationships between models
- **Statistics** - Aggregating data across records
- **Search** - Implementing search functionality

## Extending Your App

Try adding these features:

1. **Tags** - Add a tags field and tag search
2. **Due Date Reminders** - Find overdue tasks
3. **Task Dependencies** - Track which tasks block others
4. **Subtasks** - Add subtasks to main tasks
5. **User Authentication** - Add user accounts
6. **CLI Interface** - Make it interactive with prompts
7. **REST API** - Expose operations via HTTP endpoints

## Common Patterns

### Pattern 1: Helper Functions

Instead of calling model methods directly everywhere, create helper functions:

```javascript
// Good
export function createTask(title, description, priority) {
  return Task.create({
    title,
    description,
    priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// Usage
const task = createTask('My task', 'Description', 'high');
```

### Pattern 2: Computed Relationships

Manually update related counts:

```javascript
// When creating a task
if (category) {
  incrementCategoryTaskCount(category);
}

// When deleting a task
if (task.category) {
  decrementCategoryTaskCount(task.category);
}
```

### Pattern 3: Status Workflows

Track state changes with timestamps:

```javascript
export function completeTask(id) {
  Task.update(
    {
      status: 'completed',
      completedAt: new Date().toISOString(),
    },
    { id }
  );
}
```

## Next Steps

- Try the [Common Patterns](./common-patterns.md) guide
- Explore the [Discord Bot example](https://github.com/OpenUwU/rinari/tree/main/examples/discord-notes-bot)
- Read about [Advanced Features](../core-concepts.md)

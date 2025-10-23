import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

console.log('📋 Rinari Todo List Example\n');

const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});

const Todo = orm.define('default', 'todos', {
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
  completed: {
    type: DataTypes.INTEGER,
    notNull: true,
    default: 0,
  },
  priority: {
    type: DataTypes.TEXT,
    default: 'medium',
  },
  dueDate: {
    type: DataTypes.DATETIME,
  },
  createdAt: {
    type: DataTypes.DATETIME,
    notNull: true,
  },
});

Todo.createIndex('idx_completed', { columns: ['completed'] });
Todo.createIndex('idx_priority', { columns: ['priority'] });

console.log('✅ Todo list initialized\n');

function addTodo(title, description, priority = 'medium', dueDate = null) {
  const todo = Todo.create({
    title,
    description,
    priority,
    dueDate,
    completed: 0,
    createdAt: new Date().toISOString(),
  });
  console.log(`✅ Added todo #${todo.id}: ${title}`);
  return todo;
}

function listTodos(showCompleted = false) {
  const where = showCompleted ? {} : { completed: 0 };
  const todos = Todo.findAll({
    where,
    orderBy: [
      ['completed', 'ASC'],
      ['priority', 'DESC'],
      ['createdAt', 'ASC'],
    ],
  });

  console.log(showCompleted ? '\n📋 All Todos:' : '\n📋 Active Todos:');
  if (todos.length === 0) {
    console.log('  No todos found!');
    return;
  }

  todos.forEach((todo) => {
    const status = todo.completed ? '✅' : '⬜';
    const priority = { high: '🔴', medium: '🟡', low: '🟢' }[todo.priority] || '⚪';
    console.log(`  ${status} ${priority} #${todo.id}: ${todo.title}`);
    if (todo.description) {
      console.log(`     ${todo.description}`);
    }
  });
}

function completeTodo(id) {
  const todo = Todo.findOne({ where: { id } });
  if (!todo) {
    console.log(`❌ Todo #${id} not found`);
    return;
  }

  Todo.update({ completed: 1 }, { id });
  console.log(`✅ Completed todo #${id}: ${todo.title}`);
}

function getTodoStats() {
  const total = Todo.count();
  const completed = Todo.count({ completed: 1 });
  const active = total - completed;
  const highPriority = Todo.count({ completed: 0, priority: 'high' });

  console.log('\n📊 Todo Statistics:');
  console.log(`  Total: ${total}`);
  console.log(`  Active: ${active}`);
  console.log(`  Completed: ${completed}`);
  console.log(`  High Priority Active: ${highPriority}`);
}

console.log('➕ Adding todos...');
addTodo('Buy groceries', 'Milk, bread, eggs', 'high', new Date(Date.now() + 86400000).toISOString());
addTodo('Finish project', 'Complete the Rinari documentation', 'high');
addTodo('Exercise', '30 minutes cardio', 'medium');
addTodo('Read book', 'Continue reading JavaScript book', 'low');
addTodo('Call mom', 'Weekly check-in', 'medium');

listTodos();

console.log('\n✅ Completing some todos...');
completeTodo(1);
completeTodo(3);

listTodos();
listTodos(true);

getTodoStats();

console.log('\n🔍 Finding high priority todos...');
const highPriority = Todo.findAll({
  where: { priority: 'high', completed: 0 },
});
console.log(`Found ${highPriority.length} high priority todos:`, highPriority);

orm.disconnect();
console.log('\n👋 Todo list closed');

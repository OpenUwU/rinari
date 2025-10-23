import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

console.log('🚀 Rinari Basic CRUD Example\n');

const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});

const User = orm.define('default', 'users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  createdAt: {
    type: DataTypes.DATETIME,
  },
});

console.log('✅ Database and model initialized\n');

console.log('📝 Creating users...');
const alice = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
  createdAt: new Date().toISOString(),
});
console.log('Created:', alice);

const bob = User.create({
  username: 'bob',
  email: 'bob@example.com',
  age: 30,
  createdAt: new Date().toISOString(),
});
console.log('Created:', bob);

const charlie = User.create({
  username: 'charlie',
  email: 'charlie@example.com',
  age: 22,
  createdAt: new Date().toISOString(),
});
console.log('Created:', charlie, '\n');

console.log('🔍 Reading all users...');
const allUsers = User.findAll();
console.log(`Found ${allUsers.length} users:`, allUsers, '\n');

console.log('🔍 Finding user by username...');
const foundUser = User.findOne({ where: { username: 'alice' } });
console.log('Found user:', foundUser, '\n');

console.log('🔍 Finding users aged 25 or older...');
const adults = User.findAll({
  where: { age: { $gte: 25 } },
  orderBy: [['age', 'ASC']],
});
console.log(`Found ${adults.length} adults:`, adults, '\n');

console.log('✏️ Updating user...');
const updated = User.update({ age: 26 }, { username: 'alice' });
console.log(`Updated ${updated} record(s)`);

const updatedAlice = User.findOne({ where: { username: 'alice' } });
console.log('Updated user:', updatedAlice, '\n');

console.log('🗑️ Deleting user...');
const deleted = User.delete({ username: 'charlie' });
console.log(`Deleted ${deleted} record(s)`);

const remainingUsers = User.findAll();
console.log(`Remaining users: ${remainingUsers.length}`, remainingUsers, '\n');

orm.disconnect();
console.log('👋 Disconnected from database');

import { BunSQLiteDriver } from '@rinari/bun-sqlite';
import { ORM } from '@rinari/orm';
import { DataTypes } from '@rinari/types';

console.log('🚀 Rinari ORM - Bun SQLite Driver Example\n');

const driver = new BunSQLiteDriver({
  storageDir: './data',
  verbose: false,
});

const orm = new ORM({ driver });

interface User {
  id: number;
  username: string;
  email: string;
  age?: number;
  status: string;
  createdAt: string;
}

const User = orm.define<User>('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true },
  age: { type: DataTypes.INTEGER },
  status: { type: DataTypes.TEXT, default: 'active' },
  createdAt: { type: DataTypes.DATETIME, notNull: true },
});

User.createIndex('idx_status_created', {
  columns: ['status', 'createdAt'],
});

console.log('📋 CREATE - Inserting users...');

const alice = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
  status: 'active',
  createdAt: new Date().toISOString(),
});

const bob = User.create({
  username: 'bob',
  email: 'bob@example.com',
  age: 30,
  status: 'active',
  createdAt: new Date().toISOString(),
});

console.log(`✅ Created user: ${alice.username} (ID: ${alice.id})`);
console.log(`✅ Created user: ${bob.username} (ID: ${bob.id})\n`);

console.log('📚 BULK CREATE - Inserting multiple users...');

const moreUsers = User.bulkCreate([
  {
    username: 'charlie',
    email: 'charlie@example.com',
    age: 22,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    username: 'diana',
    email: 'diana@example.com',
    age: 28,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    username: 'eve',
    email: 'eve@example.com',
    age: 35,
    status: 'inactive',
    createdAt: new Date().toISOString(),
  },
]);

console.log(`✅ Bulk created ${moreUsers.length} users\n`);

console.log('🔍 READ - Finding users...');

const foundUser = User.findOne({ where: { username: 'alice' } });
console.log(`Found user by username:`, foundUser);

const activeUsers = User.findAll({
  where: { status: 'active' },
  orderBy: [['age', 'ASC']],
});
console.log(`\nFound ${activeUsers.length} active users:`);
activeUsers.forEach((user) => {
  console.log(`  - ${user.username} (age: ${user.age})`);
});

const adults = User.findAll({
  where: { age: { $gte: 25 } },
});
console.log(`\nFound ${adults.length} users aged 25 or older\n`);

console.log('📊 AGGREGATIONS - Computing statistics...');

const totalUsers = User.count();
console.log(`Total users: ${totalUsers}`);

const activeCount = User.count({ status: 'active' });
console.log(`Active users: ${activeCount}`);

const avgAge = User.avg('age');
console.log(`Average age: ${avgAge?.toFixed(1)}`);

const maxAge = User.max('age');
console.log(`Maximum age: ${maxAge}`);

const minAge = User.min('age');
console.log(`Minimum age: ${minAge}\n`);

console.log('✏️ UPDATE - Updating user status...');

const updated = User.update({ status: 'premium' }, { username: 'alice' });
console.log(`Updated ${updated} user(s) to premium status`);

const bulkUpdated = User.bulkUpdate([
  { where: { username: 'bob' }, data: { status: 'premium' } },
  { where: { username: 'charlie' }, data: { age: 23 } },
]);
console.log(`Bulk updated ${bulkUpdated} user(s)\n`);

console.log('🔄 TRANSACTIONS - Testing atomic operations...');

try {
  const result = orm.getDriver().transaction(() => {
    const newUser = User.create({
      username: 'frank',
      email: 'frank@example.com',
      age: 40,
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    User.update({ status: 'verified' }, { id: newUser.id });

    return newUser;
  });

  console.log(`✅ Transaction succeeded: Created ${result.username} and verified\n`);
} catch (error) {
  console.log(`❌ Transaction failed and rolled back\n`);
}

console.log('🗑️ DELETE - Removing inactive users...');

const deleted = User.delete({ status: 'inactive' });
console.log(`Deleted ${deleted} inactive user(s)\n`);

console.log('📝 FINAL STATE - All remaining users:');
const allUsers = User.findAll({ orderBy: [['id', 'ASC']] });
allUsers.forEach((user) => {
  console.log(
    `  ID: ${user.id} | ${user.username} | ${user.email} | Age: ${user.age} | Status: ${user.status}`
  );
});

console.log(`\n✨ Example completed successfully!`);
console.log(`Total operations: CREATE, READ, UPDATE, DELETE, AGGREGATIONS, TRANSACTIONS`);

orm.disconnect();

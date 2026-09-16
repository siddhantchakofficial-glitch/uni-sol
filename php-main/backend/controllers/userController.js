import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';

// Fallback in-memory database store if MongoDB daemon is offline
let mockUsers = [
  {
    _id: '1',
    name: 'Sumit Kumar',
    email: 'sumit.kumar@example.com',
    role: 'Super Admin',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Alexander Wright',
    email: 'alex.w@example.com',
    role: 'Editor',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'Michael Scott',
    email: 'michael.s@example.com',
    role: 'Viewer',
    status: 'Inactive',
    createdAt: new Date().toISOString()
  }
];

// Seed MongoDB if connected and empty
const seedIfNeeded = async () => {
  if (getDBStatus()) {
    try {
      const count = await User.countDocuments();
      if (count === 0) {
        await User.insertMany(mockUsers.map(u => ({
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          password: 'password123'
        })));
        console.log('Seeded initial users into MongoDB');
      }
    } catch (err) {
      console.error('Error seeding MongoDB:', err);
    }
  }
};

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    if (getDBStatus()) {
      await seedIfNeeded();
      const users = await User.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, data: users });
    } else {
      return res.json({ success: true, count: mockUsers.length, data: mockUsers, storage: 'in-memory' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (getDBStatus()) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, data: user });
    } else {
      const user = mockUsers.find(u => u._id === id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, data: user });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users
export const createUser = async (req, res) => {
  const { name, email, role, status, password } = req.body;
  try {
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' });
    }

    if (getDBStatus()) {
      const newUser = await User.create({
        name,
        email,
        role: role || 'Editor',
        status: status || 'Active',
        password: password || 'password123'
      });
      return res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
    } else {
      const newUser = {
        _id: String(Date.now()),
        name,
        email,
        role: role || 'Editor',
        status: status || 'Active',
        createdAt: new Date().toISOString()
      };
      mockUsers.unshift(newUser);
      return res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id - EDIT USER DETAILS
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  try {
    if (getDBStatus()) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (status) user.status = status;

      const updatedUser = await user.save();
      return res.json({
        success: true,
        message: 'User details updated successfully',
        data: updatedUser
      });
    } else {
      const index = mockUsers.findIndex(u => u._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      mockUsers[index] = {
        ...mockUsers[index],
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(status && { status })
      };

      return res.json({
        success: true,
        message: 'User details updated successfully',
        data: mockUsers[index]
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (getDBStatus()) {
      await User.findByIdAndDelete(id);
      return res.json({ success: true, message: 'User deleted successfully' });
    } else {
      mockUsers = mockUsers.filter(u => u._id !== id);
      return res.json({ success: true, message: 'User deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

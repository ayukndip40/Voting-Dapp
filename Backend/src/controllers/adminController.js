const User = require('../models/userModel');

// Function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(`Error fetching users: ${error.message}`);
    res.status(500).send('Server Error');
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    res.status(500).send('Server Error');
  }
};

// Function to update a user's role
const updateUserRole = async (req, res) => {
  const { role } = req.body;

}
module.exports = {
  getAllUsers,
  deleteUser,
};

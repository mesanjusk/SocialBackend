const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//
// ✅ PUBLIC ROUTES
//

// ✅ Admin login by center code
// ✅ Admin login by center code
router.post('/institute/login', authController.instituteLogin);

// ✅ General user login
router.post('/user/login', authController.userLogin);


// ✅ Forgot password
router.post('/institute/forgot-password', authController.forgotPassword);

// ✅ Reset password
router.post('/institute/reset-password/:id', authController.resetPassword);

// ✅ Register new user under institute
router.post('/register', authController.registerUser);

// ✅ Get users by institute_uuid
router.get('/GetUserList/:institute_id', authController.getUserList);

// ✅ Get user by ID
router.get('/:id', authController.getUser);

// ✅ Delete user
router.delete('/:id', authController.deleteUser);

// ✅ Update user
router.put('/:id', authController.updateUser);

module.exports = router;

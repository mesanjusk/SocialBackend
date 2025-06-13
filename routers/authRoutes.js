const express = require('express');
const { v4: uuid } = require('uuid');
const User = require('../models/User');

const router = express.Router();

router.post("/register", async (req, res) => {
    const{name, password, mobile, type}=req.body

    try{
        const check=await User.findOne({ mobile: mobile })
       
        if(check){
            res.json("exist")
        }
        else{
          const newUser = new User({
            name,
            password,
            mobile,
            type,
            user_uuid: uuid()
        });
        await newUser.save(); 
        res.json("notexist");
        }

    }
    catch(e){
      console.error("Error saving user:", e);
      res.status(500).json("fail");
    }
  });

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
      const user = await User.findOne({ name });

      if (!user) {
          return res.json({ status: "notexist" });
      }

      if (password === user.password) {
          res.json({
              status: "exist",
              type: user.type,
              mobile: user.mobile,
          });
      } else {
          res.json({ status: "invalid", message: "Invalid credentials." });
      }
  } catch (e) {
      console.error("Error during login:", e);
      res.json({ status: "fail" });
  }
});

router.get("/GetUserList", async (req, res) => {
    try {
      let data = await User.find({});
  
      if (data.length)
        res.json({ success: true, result: data.filter((a) => a.name) });
      else res.json({ success: false, message: "User Not found" });
    } catch (err) {
      console.error("Error fetching users:", err);
        res.status(500).json({ success: false, message: err });
    }
  });

  router.get('/:id', async (req, res) => {
  const { id } = req.params; 

  try {
      const user = await User.findById(id);  

      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'User not found',
          });
      }

      res.status(200).json({
          success: true,
          result: user,
      });
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
          success: false,
          message: 'Error fetching user',
          error: error.message,
      });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const users = await User.findById(req.params.id);

    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id); 
    res.json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, mobile, type, password } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { name, mobile, type, password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      result: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
});

module.exports = router;

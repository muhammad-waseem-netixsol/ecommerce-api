const User = require("../model/user.js");
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// login route
 exports.login = (req, res) => {
    console.log("logging in...")
    const { email, password } = req.body;
    User.findOne({ email })
      .then(user => {
        console.log(user)
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
   return bcrypt.compare(password, user.password)
          .then(passwordMatch => {
            console.log("matching => ")
            if (!passwordMatch) {
              return res.status(401).json({ message: 'Invalid email or password' });
            }
            const token = jwt.sign({ userId: user }, 'jhsbcshvbhcjasvdcjhs', { expiresIn: '1h' });
            res.json({ token });
          });
      })
      .catch(error => {
        res.status(500).json({ message: 'Internal server error' });
      });
};

// sign up request 
// Signup route
exports.signUp = async (req, res) => {
    console.log("signing you up...");
    const { name,email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).send({ message: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword)
      const newUser = new User({
        name,
        email,
        password:hashedPassword, 
        cart: [] 
      });
      const user = await newUser.save();
      res.status(201).send({user});
    } catch (error) {
      res.status(500).send({ message: 'Internal server error....' });
    }
};
  

// getting all users 
exports.getUsers = async (req, res) => {
    User.find().then(users => res.send({users:users})).catch(err => res.send({err: "err fetching users"}));
};
const express = require('express');
const router = express.Router();

const User = require('../controllers/user.controller');

router.get('/profile', User.getProfile);

module.exports = router;
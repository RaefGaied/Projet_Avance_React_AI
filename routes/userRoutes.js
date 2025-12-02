const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const User = require('../models/User');

router.post('/register', userController.register); 
router.post('/login', userController.login);      
router.get('/', async (req, res) => {
    res.json({ message: 'Bienvenue sur la route publique des utilisateurs' });
});


router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/all', protect, userController.getAllUsers);
router.get('/:id', protect, userController.getUserById);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;

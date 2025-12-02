const Profile = require('../models/Profile');

exports.createProfile = async (req, res) => {
  try {
    const profile = await Profile.create({
      user: req.params.userId,
      ...req.body
    });
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getProfileByUser = async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.userId }).populate('user');
  if (!profile) return res.status(404).json({ message: 'Profil non trouvé' });
  res.json(profile);
};

exports.updateProfile = async (req, res) => {
  const updated = await Profile.findOneAndUpdate(
    { user: req.params.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
};

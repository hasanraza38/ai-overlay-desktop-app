import jwt from 'jsonwebtoken';

export const googleCallback = (req, res) => {
  const user = req.user;
  const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
};

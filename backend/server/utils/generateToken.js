import jwt from 'jsonwebtoken';

export const generateToken = (id, role = 'student') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

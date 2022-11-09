import bcrypt from 'bcrypt';

export default async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (err) {
    throw err;
  }
};

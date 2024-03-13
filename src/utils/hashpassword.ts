import bcrypt from 'bcrypt';

const passwordHash = async (password: string | Buffer) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export default passwordHash;

import bcrypt from 'bcrypt'

const hashString = async (str: string) => {
  const salt = await bcrypt.genSalt(10)
  const hashedString = await bcrypt.hash(str, salt)

  return hashedString
}

export default hashString

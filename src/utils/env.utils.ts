import dotenv from 'dotenv'
dotenv.config()

export const getEnv = (name: string): string => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`The ${name} env variable must be provided!`)
  }

  return value.toString()
}

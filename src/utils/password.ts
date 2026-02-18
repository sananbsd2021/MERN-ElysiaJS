import bcrypt from 'bcryptjs'

export const passwordUtils = {
    hash: async (password: string) => await bcrypt.hash(password, 10),
    compare: async (password: string, hash: string) => await bcrypt.compare(password, hash)
}

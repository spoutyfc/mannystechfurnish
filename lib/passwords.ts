import bcrypt from 'bcryptjs'

/** One cost factor for every admin hash, so login timing does not depend on how a hash was made. */
export const BCRYPT_COST = 12

let dummyHash: Promise<string> | null = null

/**
 * A real hash at the same cost as stored hashes. Login compares against it when
 * the email is unknown, so "no such account" takes as long as "wrong password".
 */
export function getDummyHash(): Promise<string> {
  dummyHash ??= bcrypt.hash('timing-equaliser-not-a-password', BCRYPT_COST)
  return dummyHash
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST)
}

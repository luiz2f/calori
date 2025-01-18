export async function saltAndHashPassword(password: string): Promise<string> {
  const saltLength = 16
  const iterations = 1000
  const keyLength = 64
  const digest = 'SHA-512'

  try {
    const salt = crypto.getRandomValues(new Uint8Array(saltLength))

    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    const combinedBuffer = new Uint8Array(passwordBuffer.length + salt.length)
    combinedBuffer.set(passwordBuffer)
    combinedBuffer.set(salt, passwordBuffer.length)

    const hashBuffer = await crypto.subtle.digest(digest, combinedBuffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = hashArray
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')

    const saltHex = Array.from(salt)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')

    return `${saltHex}:${hash}`
  } catch (err) {
    throw new Error('Failed to hash password')
  }
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, originalHash] = storedHash.split(':')
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  )

  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)
  const combinedBuffer = new Uint8Array(passwordBuffer.length + salt.length)
  combinedBuffer.set(passwordBuffer)
  combinedBuffer.set(salt, passwordBuffer.length)

  const hashBuffer = await crypto.subtle.digest('SHA-512', combinedBuffer)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')

  return hash === originalHash
}

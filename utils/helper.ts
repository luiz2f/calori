export async function saltAndHashPassword(password: string): Promise<string> {
  const saltLength = 16
  const iterations = 100000 // Um número maior de iterações
  const keyLength = 64
  const digest = 'SHA-512'

  try {
    const salt = crypto.getRandomValues(new Uint8Array(saltLength))

    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)

    // Usando PBKDF2 para gerar o hash com salt e iterações
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: digest
      },
      keyMaterial,
      { name: 'HMAC', hash: { name: 'SHA-512' }, length: keyLength * 8 },
      true,
      ['sign']
    )

    const hashBuffer = await crypto.subtle.exportKey('raw', derivedKey)

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

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-512'
    },
    keyMaterial,
    { name: 'HMAC', hash: { name: 'SHA-512' }, length: 512 },
    true,
    ['sign']
  )

  const hashBuffer = await crypto.subtle.exportKey('raw', derivedKey)
  const hashArray = new Uint8Array(hashBuffer)

  const originalHashBuffer = new Uint8Array(
    originalHash?.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  )

  if (hashArray.length !== originalHashBuffer.length) {
    return false
  }

  let isValid = 1
  for (let i = 0; i < hashArray.length; i++) {
    isValid &= hashArray[i] === originalHashBuffer[i] ? 1 : 0
  }
  return isValid === 1
}

export function generateUsername(): string {
  const adjectives = ['happy', 'clever', 'brave', 'kind', 'wise']
  const nouns = ['cat', 'dog', 'bird', 'fox', 'wolf']
  const numbers = Math.floor(Math.random() * 1000)

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]

  return `${adjective}_${noun}_${numbers}`
}

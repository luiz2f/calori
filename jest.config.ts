// filepath: c:\Users\User\Desktop\git\caloricalori\jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest', // Usa o preset do ts-jest para suporte ao TypeScript
  testEnvironment: 'jest-environment-jsdom', // Define o ambiente de teste como jsdom
  clearMocks: true, // Limpa os mocks automaticamente antes de cada teste
  coverageProvider: 'v8', // Define o provedor de cobertura de código
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1' // Mapeia os aliases do TypeScript
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest' // Transforma arquivos TypeScript usando ts-jest
  },
  testMatch: [
    '**/tests/**/*.(spec|test).[jt]s?(x)' // Define o padrão para localizar arquivos de teste
  ]
}

export default config

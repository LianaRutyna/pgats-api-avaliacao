import { randomBytes } from 'k6/crypto';

/**
 * Gera um email aleatório para Data-Driven Testing
 * Conceito: Faker/Data-Driven Testing
 */
export function generateRandomEmail() {
  const random = randomBytes(4, 'hex');
  return `user_${random}@test.com`;
}

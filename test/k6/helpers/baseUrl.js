/**
 * Obtém a URL base da API via variável de ambiente
 * Conceito: Variável de Ambiente
 */
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}

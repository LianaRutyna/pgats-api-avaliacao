#!/bin/bash

# Script para rodar os testes de performance com K6
# Uso: ./run-k6-tests.sh

echo "🚀 Iniciando testes de performance com K6"
echo "==========================================="

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se K6 está instalado
if ! command -v k6 &> /dev/null; then
    echo -e "${RED}❌ K6 não está instalado!${NC}"
    echo "Para instalar K6, veja: https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Verificar versão do K6
K6_VERSION=$(k6 version)
echo -e "${GREEN}✓ K6 detectado:${NC} $K6_VERSION"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js detectado${NC}"

# Verificar se arquivo de teste existe
if [ ! -f "test/k6/checkout.test.js" ]; then
    echo -e "${RED}❌ Arquivo de teste não encontrado: test/k6/checkout.test.js${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Arquivo de teste encontrado${NC}"

# Pedir input do usuário
echo ""
echo "Escolha uma opção:"
echo "1. Rodar teste (output no terminal)"
echo "2. Rodar teste com resumo detalhado"
echo "3. Gerar relatório HTML"
echo ""
read -p "Digite a opção (1-3): " option

BASE_URL="http://localhost:3000"

case $option in
    1)
        echo -e "${YELLOW}Rodando teste...${NC}"
        k6 run -e BASE_URL=$BASE_URL test/k6/checkout.test.js
        ;;
    2)
        echo -e "${YELLOW}Rodando teste com resumo detalhado...${NC}"
        k6 run --summary-trend-stats="avg,min,max,p(95),p(99)" \
          -e BASE_URL=$BASE_URL \
          test/k6/checkout.test.js
        ;;
    3)
        echo -e "${YELLOW}Gerando relatório HTML...${NC}"
        k6 run --out html=report.html \
          -e BASE_URL=$BASE_URL \
          test/k6/checkout.test.js
        echo -e "${GREEN}✓ Relatório gerado:${NC} report.html"
        ;;
    *)
        echo -e "${RED}Opção inválida!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Teste finalizado!${NC}"

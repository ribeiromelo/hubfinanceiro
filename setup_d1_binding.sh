#!/bin/bash

# Configuração
PROJECT_NAME="fermhubfinanceiro"
DATABASE_ID="11f2eaab-fcb3-4ed4-9246-994e69baf0cb"
DATABASE_NAME="fermhubfinanceiro-production"
BINDING_NAME="DB"

# Obter account ID
ACCOUNT_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" | jq -r '.result[0].id')

echo "Account ID: $ACCOUNT_ID"

# Configurar binding D1 para produção
echo "Configurando D1 binding para produção..."
curl -X PATCH "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"deployment_configs\": {
      \"production\": {
        \"d1_databases\": {
          \"$BINDING_NAME\": {
            \"id\": \"$DATABASE_ID\"
          }
        }
      }
    }
  }" | jq '.'

echo -e "\n✅ Binding D1 configurado!"
echo "🌐 Acesse: https://fermhubfinanceiro.pages.dev/"

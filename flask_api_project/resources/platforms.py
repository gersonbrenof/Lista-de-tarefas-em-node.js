from flask_restful import Resource
import requests
import csv
import io
import pandas as pd
from config import API_BASE_URL, API_TOKEN,API_ACCOUNTS_ENDPOINT, API_FIELDS_ENDPOINT, API_INSIGHTS_ENDPOINT

class PlatformResource(Resource):
   def get(self, platform):
        try:
            # 1. Obter as contas da plataforma
            accounts_url = f'{API_BASE_URL}{API_ACCOUNTS_ENDPOINT.format(platform=platform)}'
            accounts_response = requests.get(accounts_url, headers={'Authorization': f'Bearer {API_TOKEN}'})
            accounts_response.raise_for_status()  # Verifica se a requisição foi bem-sucedida
            accounts = accounts_response.json()

            # Verifica se a resposta contém uma lista de contas
            if not isinstance(accounts, list):
                return {'message': 'Unexpected response format: expected a list of accounts'}, 500

            # 2. Obter os campos da plataforma
            fields_url = f'{API_BASE_URL}{API_FIELDS_ENDPOINT.format(platform=platform)}'
            fields_response = requests.get(fields_url, headers={'Authorization': f'Bearer {API_TOKEN}'})
            fields_response.raise_for_status()  # Verifica se a requisição foi bem-sucedida
            fields = fields_response.json()

            # Verifica se a resposta contém uma lista de campos
            if not isinstance(fields, list):
                return {'message': 'Unexpected response format: expected a list of fields'}, 500

            # 3. Obter os insights de cada conta
            insights = []
            for account in accounts:
                # Verifica se a conta tem os campos necessários
                if not isinstance(account, dict) or 'id' not in account or 'name' not in account:
                    continue  # Ignora contas inválidas

                account_id = account['id']
                account_name = account['name']
                insights_url = f"{API_BASE_URL}{API_INSIGHTS_ENDPOINT.format(platform=platform, account=account_id, token=API_TOKEN, fields=','.join(fields))}"

                insights_response = requests.get(insights_url, headers={'Authorization': f'Bearer {API_TOKEN}'})
                insights_response.raise_for_status()  # Verifica se a requisição foi bem-sucedida
                account_insights = insights_response.json()

                # Verifica se a resposta contém uma lista de insights
                if not isinstance(account_insights, list):
                    continue  # Ignora respostas inválidas

                # Adiciona o nome da conta a cada insight
                for insight in account_insights:
                    insight['account_name'] = account_name
                insights.extend(account_insights)

            # 4. Gerar o relatório CSV
            output = io.StringIO()
            fieldnames = ['Platform', 'Account Name'] + fields  # Define o cabeçalho do CSV
            writer = csv.DictWriter(output, fieldnames=fieldnames)
            writer.writeheader()

            # Escreve os dados no CSV
            for insight in insights:
                row = {
                    'Platform': platform,
                    'Account Name': insight.get('account_name', ''),
                    **{field: insight.get(field, '') for field in fields}
                }
                writer.writerow(row)

            # 5. Retornar o relatório como resposta
            report = output.getvalue()
            return report, 200, {'Content-Type': 'text/csv'}

        except requests.exceptions.RequestException as e:
            # Trata erros de requisição
            return {'message': f'Error fetching data from API: {str(e)}'}, 500
        except Exception as e:
            # Trata outros erros inesperados
            return {'message': f'An unexpected error occurred: {str(e)}'}, 500
    
# class PlatformSummaryResource(Resource):
#     PLATFORM_MAP = {
#         "Facebook": "meta_ads",  # Use o nome que aparece no desafio
#         "YouTube": "ga4",        # Exemplo: "YouTube" em vez de "Google Analytics"
#         "TikTok": "tiktok_insights"
#     }

#     def get(self, platform_name):
#         # Verificar se a plataforma está no mapeamento
#         platform_value = self.PLATFORM_MAP.get(platform_name)
#         if not platform_value:
#             return {"error": "Plataforma inválida", "supported_platforms": list(self.PLATFORM_MAP.keys())}, 400

#         # URL para buscar as contas da plataforma
#         url = f"{API_BASE_URL}/accounts?platform={platform_value}"
        
#         headers = {
#             "Authorization": f"Bearer {API_TOKEN}"
#         }
        
#         response = requests.get(url, headers=headers)
        
#         if response.status_code != 200:
#             return {"message": f"Erro ao buscar dados da plataforma {platform_name}"}, 500

#         data = response.json()

#         if not data.get('accounts'):
#             return {"message": "Nenhuma conta encontrada."}, 404

#         ad_data = []

#         # Buscar os anúncios das contas
#         for account in data['accounts']:
#             ad_url = f"{API_BASE_URL}/ads?account_id={account['id']}&platform={platform_value}"
#             ad_response = requests.get(ad_url, headers=headers)
            
#             if ad_response.status_code == 200:
#                 ad_insights = ad_response.json()

#                 # Verificar se há anúncios na resposta
#                 if not ad_insights.get('ads'):
#                     print(f"Nenhum anúncio encontrado para a conta {account['id']} na plataforma {platform_name}.")
#                     continue

#                 for ad in ad_insights.get('ads', []):
#                     ad_record = {
#                         "Platform": platform_name,
#                         "Ad Name": ad.get('name', 'N/A'),
#                         "Account Name": account.get('name', 'N/A'),
#                     }

#                     # Adicionar todos os campos de insights (exceto 'id' e 'name')
#                     for key, value in ad.items():
#                         if key not in ["id", "name"]:
#                             ad_record[key] = value if isinstance(value, (int, float)) else 0
                    
#                     ad_data.append(ad_record)
#             else:
#                 print(f"Erro ao buscar anúncios para a conta {account['id']} na plataforma {platform_name}.")
#                 continue

#         if ad_data:
#             # Criação do DataFrame
#             df = pd.DataFrame(ad_data)

#             # Agregando os dados por "Account Name" e somando as colunas numéricas
#             aggregated_df = df.groupby('Account Name').agg({
#                 'Platform': 'first',  # Apenas o nome da plataforma para a conta
#                 'Ad Name': 'first',  # Mantém o nome do anúncio da primeira linha
#                 'Clicks': 'sum',  # Somando cliques
#                 # Adicione aqui outros campos numéricos que deseja somar
#             }).reset_index()

#             # Convertendo o DataFrame em CSV
#             csv_data = aggregated_df.to_csv(index=False)

#             return csv_data, 200, {
#                 'Content-Type': 'text/csv',
#                 'Content-Disposition': f'attachment; filename={platform_name}_summary.csv'
#             }

#         return {"message": "Nenhum anúncio encontrado para a plataforma."}, 404
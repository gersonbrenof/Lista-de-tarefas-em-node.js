from flask_restful import Resource, reqparse
import requests
import csv
import io
import pandas as pd
from config import API_BASE_URL, API_TOKEN
from io import StringIO
class GeralResource(Resource):
    def get(self):
        all_data = []  # Lista para armazenar todos os dados
        all_columns = set()  # Conjunto para armazenar todas as colunas únicas

        headers = {
            'Authorization': f'Bearer {API_TOKEN}'  # Cabeçalho de autorização com o token
        }

        url = f"{API_BASE_URL}/platforms"  # URL para obter os dados das plataformas
        try:
            # Faz a requisição à API
            response = requests.get(url, headers=headers)
            response.raise_for_status()  # Verifica se a resposta tem um status de erro (4xx ou 5xx)

            try:
                data = response.json()  # Tenta converter a resposta em JSON
            except ValueError:
                return {'message': "Error parsing JSON response"}, 500

            # Verifica o formato da resposta
            print("Resposta da API:", data)  # Debug: Verifique o formato da resposta

            # Se a resposta for um dicionário, tenta extrair a lista de dados
            if isinstance(data, dict):
                # Verifica se a chave 'platforms' existe (ou outra chave relevante)
                if 'platforms' in data:
                    data = data['platforms']  # Extrai a lista de dados
                else:
                    return {'message': "Unexpected data format: response is a dictionary but no 'platforms' key found"}, 500

            # Verifica se a resposta é uma lista
            if not isinstance(data, list):
                return {'message': "Unexpected data format: expected a list"}, 500

            # Processa cada anúncio (ad) na lista de dados
            for ad in data:
                # Verifica se o anúncio é um dicionário
                if not isinstance(ad, dict):
                    continue  # Ignora itens que não são dicionários

                # Adiciona campos padrão, se não existirem
                ad['platform'] = ad.get('platform', 'N/A')
                ad['account_name'] = ad.get('account_name', 'N/A')

                # Cálculo do CPC (Cost per Click), exceto para Google Analytics
                spend = ad.get('spend')
                clicks = ad.get('clicks')

                if ad['platform'] != 'Google Analytics' and isinstance(spend, (int, float)) and isinstance(clicks, (int, float)) and clicks > 0:
                    ad['Cost per Click'] = round(spend / clicks, 2)  # Calcula o CPC
                else:
                    ad['Cost per Click'] = ''  # Define como vazio se não for possível calcular

                # Atualiza o conjunto de colunas com as chaves do anúncio
                all_columns.update(ad.keys())

                # Adiciona o anúncio processado à lista de dados
                all_data.append(ad)

        except requests.exceptions.RequestException as e:
            # Trata erros de requisição
            print(f"Error fetching data: {e}")
            return {'message': "Error fetching data"}, 500

        # Verifica se há dados para retornar
        if not all_data:
            return {'message': 'No data available'}, 404

        # Gera o CSV com todas as colunas presentes na API
        output = io.StringIO()
        fieldnames = sorted(all_columns)  # Ordena as colunas para manter um formato consistente

        # Cria o escritor CSV
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()  # Escreve o cabeçalho
        writer.writerows(all_data)  # Escreve os dados

        # Retorna o CSV como resposta
        return output.getvalue(), 200, {'Content-Type': 'text/csv'}
class ResumoResource(Resource):
   def get(self):
    platforms = ['Facebook', 'YouTube', 'Google Analytics']  # Lista das plataformas
    all_data = []  # Lista para armazenar os dados de todas as plataformas

    headers = {
        'Authorization': f'Bearer {API_TOKEN}'  # Passando o token no cabeçalho de autorização
    }

    # Coletando dados de todas as plataformas
    for platform in platforms:
        url = f"{API_BASE_URL}/platforms?platform={platform}"
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()

            data = response.json()

            if 'platforms' in data:
                data = data['platforms']  # Ajusta para pegar os dados da chave 'platforms'

            if not isinstance(data, list):
                return {'message': f"Unexpected data format for platform {platform}"}, 500

            # Processando os dados de cada conta
            for account in data:
                account['platform'] = platform
                account['account_name'] = account.get('account_name', 'N/A')

                # Calculando "Cost per Click" com NaN se não for possível calcular
                if 'spend' in account and 'clicks' in account and account['clicks'] > 0:
                    account['Cost per Click'] = account['spend'] / account['clicks']
                else:
                    account['Cost per Click'] = float('nan')  # Usando NaN para cálculos futuros

                all_data.append(account)

        except requests.exceptions.RequestException as e:
            return {'message': f"Error fetching data for platform {platform}"}, 500
        except ValueError as e:
            return {'message': f"Error parsing JSON for platform {platform}"}, 500

    # Agrupando e processando os dados
    if all_data:
        df = pd.DataFrame(all_data)
        
        # Agrupando por plataforma e calculando a média de 'Cost per Click'
        df_resumo = df.groupby('platform', as_index=False).agg({
            'account_name': 'first',  # Será substituído abaixo
            'Cost per Click': 'mean'
        })

        # Forçando 'account_name' para 'N/A' e tratando valores NaN
        df_resumo['account_name'] = 'N/A'
        df_resumo['Cost per Click'] = df_resumo['Cost per Click'].fillna('N/A')
        
        # Selecionando apenas as colunas desejadas e ordenando
        df_resumo = df_resumo[['platform', 'account_name', 'Cost per Click']]

        # Convertendo para CSV
        output = StringIO()
        df_resumo.to_csv(output, index=False)
        output.seek(0)

        return output.getvalue(), 200
    else:
        return {'message': 'No data available for the requested platforms'}, 404
from flask import Flask, jsonify    
from flask_restful import Api
from resources.home import HomeResource 
from resources.platforms import PlatformResource
from resources.geral import GeralResource, ResumoResource

# Criando a instância do Flask
app = Flask(__name__)

# Criando a instância da API
api = Api(app)

# Adicionando um recurso à API
api.add_resource(HomeResource, "/")
api.add_resource(PlatformResource, "/<string:platform>")

# api.add_resource(PlatformSummaryResource, "/platform/")
api.add_resource(GeralResource, "/geral")
api.add_resource(ResumoResource, "/geral/resumo")


# Rodando a aplicação Flask
if __name__ == "__main__":
    app.run(debug=True)
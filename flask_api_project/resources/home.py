from flask_restful import Resource
from flask import Flask, jsonify 

class HomeResource(Resource):
    def get(self):
        return jsonify({
        "Nome": "Gerson Breno Fagundes de Oliveira ",
        "Email": "gersonfagundes2016@gmail.com",
        "LinkedIn": "https://www.linkedin.com/in/gerson-fagundes-33a37319a/",
        
    })


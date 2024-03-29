from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_cors import CORS

# Initiliaze Flask app object with configs
app = Flask(__name__)
app.config.from_object('config')
CORS(app)

# Initialize Flask-SQLAlchemy db object
db = SQLAlchemy(app)
# Initialize Flask-RESTful api object
api = Api(app)

# Attach routes to the Flask-RESTful Resource objects found at controllers/*
from . import routes
routes.add_routes()

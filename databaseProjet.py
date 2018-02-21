from flask_sqlalchemy import SQLAlchemy
from main import app
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
SQLALCHEMY_TRACK_MODIFICATIONS=TRUE
db = SQLAlchemy(app)

#BDD Configuration
class ConfigList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    configs = db.relationship('Config', backref='config_list', lazy='dynamic')

class Config(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.Text)
    config_list_id = db.Column(db.Integer, db.ForeignKey('config_list.id'))
    fichier = db.Column(db.Text)
    date_creation=db.Column(db.Text)
    date_modification=db.Column(db.Text)
    configRef = db.relationship('ReseauList', backref='config', lazy='dynamic')
    configComp = db.relationship('ComputerList', backref='config', lazy='dynamic')
    configRole= db.relationship('RoleList', backref='config', lazy='dynamic')

#BDD Reseaux
class ReseauList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    reseaux = db.relationship('Reseau', backref='reseau_list', lazy='dynamic')
    config_id = db.Column(db.Integer, db.ForeignKey('config.id'))

class Reseau(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reseau_list_id = db.Column(db.Integer, db.ForeignKey('reseau_list.id'))
    label = db.Column(db.Text)
    part1 = db.Column(db.Text)
    part2 = db.Column(db.Text)
    part3 = db.Column(db.Text)
    #cidr
    cidr1 = db.Column(db.Text)
    cidr2 = db.Column(db.Text)
    #start
    start = db.Column(db.Text)
    #end
    end = db.Column(db.Text)
    #gateway
    gateway = db.Column(db.Text)
    #dns
    dns1 = db.Column(db.Text)
    dns2 = db.Column(db.Text)
    dns3 = db.Column(db.Text)
    dns4 = db.Column(db.Text)

class ComputerList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    computers=db.relationship('Computer', backref='computer_list', lazy='dynamic')
    config_id = db.Column(db.Integer, db.ForeignKey('config.id'))
    
    
class Computer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.Text)
    user = db.Column(db.Text)
    role = db.Column(db.Text)
    computer_list_id = db.Column(db.Integer, db.ForeignKey('computer_list.id'))

#Les roles
    
class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Text)
    role_list_id = db.Column(db.Integer, db.ForeignKey('role_list.id'))
    
class RoleList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    roles=db.relationship('Role', backref='role_list', lazy='dynamic')
    config_id =db.Column(db.Integer, db.ForeignKey('config.id'))

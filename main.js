from flask import Flask
from flask import request, url_for, redirect, session, render_template
app = Flask("firstFormApplication")
app.secret_key = "very_important_secret"


#Creation d une nouvelle configuration
@app.route("/")
@app.route("/<config_list_name>")
def generate_form(config_list_name=None):
    from databaseProjet import Config, ConfigList
    # If no "config_list_name" parameter is provided, redirect to "default"
    if config_list_name is None:
        return redirect(url_for("generate_form", config_list_name="default"))
    existing_config_list = ConfigList.query.filter_by(name=config_list_name).first()
    # If no existing config list, then create a new one
    if existing_config_list is None:
        new_config_list = ConfigList()
        new_config_list.name = config_list_name
        db.session.add(new_config_list)
        db.session.commit()
        existing_config_list = new_config_list
    # Render the form usign the current config list

    return render_template("form.html", config_list=existing_config_list)

@app.route("/form_handler", methods=["POST"])
def form_handler():
    from databaseProjet import Config
    from datetime import date
    config_list_id = request.form["config_list_id"]
    config_list_name = request.form["config_list_name"]
    config_text = request.form["config_text"]
    # Create a new config
    new_config = Config()
    new_config.label = config_text
    new_config.config_list_id = config_list_id # Make the link between config and configList
    new_config.date_creation=date.today()
    new_config.date_modification=date.today()
    db.session.add(new_config)
    db.session.commit()
    config_id=new_config.id
    return redirect(url_for("generate_form", config_list_name=config_list_name))


 
@app.route("/delete/<config_id>")
def delete(config_id):
    from databaseProjet import Config
    to_delete=Config.query.filter_by(id=config_id).first()
    db.session.delete(to_delete)
    db.session.commit()
    return redirect(url_for("generate_form"))

@app.route("/reseaulistname/<config_id>")
def reseaulistname(config_id):
    from databaseProjet import Config, ReseauList
    from datetime import date
    import random
    # existing_config_list = ConfigList.query.filter_by(name=config_list_name).first()
    config=Config.query.filter_by(id=config_id).first()
    config.date_modification=date.today()
    db.session.commit()
    reseau_list=ReseauList.query.filter_by(config_id=config_id).first()
    if reseau_list is None:
        reseau_list_name= random.random()
        return (redirect(url_for("generate_form_reseau", config_idd=config_id, reseau_list_name=reseau_list_name)))
    reseau_list_name=reseau_list.name
    return (redirect(url_for("generate_form_reseau", config_idd=config_id, reseau_list_name=reseau_list_name)))

# Configuration des reseaux
@app.route("/a/<config_idd>/<reseau_list_name>")
def generate_form_reseau(config_idd, reseau_list_name):
    from databaseProjet import Reseau, ReseauList
    # If no "reseau_list_name" parameter is provided, redirect to "default"
    if reseau_list_name is None:
        return redirect(url_for("generate_form_reseau", config_idd=config_id, reseau_list_name="default"))
    existing_reseau_list = ReseauList.query.filter_by(name=reseau_list_name).first()
    # If no existing reseau list, then create a new one
    if existing_reseau_list is None:
        new_reseau_list = ReseauList()
        new_reseau_list.name = reseau_list_name
        new_reseau_list.config_id=config_idd
        db.session.add(new_reseau_list)
        db.session.commit()
        existing_reseau_list = new_reseau_list
    # Render the form usign the current reseau list
    return render_template("edit.html", reseau_list=existing_reseau_list)


@app.route("/form_handler_reseau", methods=["POST"])
def form_handler_reseau():
    from databaseProjet import Reseau
    reseau_list_id = request.form["reseau_list_id"]
    reseau_text= request.form["reseau_text"]
    reseau_list_name = request.form["reseau_list_name"]
    reseau_list_config_id = request.form["reseau_list_config_id"]
    reseau_1 = request.form["reseau_1"]
    reseau_2 = request.form["reseau_2"]
    reseau_3 = request.form["reseau_3"]
    #cidr
    reseau_cidr1 = request.form["reseau_cidr1"]
    reseau_cidr2 = request.form["reseau_cidr2"]
    #start
    reseau_start = request.form["reseau_start"]
    #end
    reseau_end = request.form["reseau_end"]
    #gateway    
    reseau_gateway = request.form["reseau_gateway"]
    #dns
    reseau_dns1 = request.form["reseau_dns1"]
    reseau_dns2 = request.form["reseau_dns2"]
    reseau_dns3 = request.form["reseau_dns3"]
    reseau_dns4 = request.form["reseau_dns4"]
 
    # Create a new reseau
    new_reseau = Reseau()
    new_reseau.label = reseau_text
    new_reseau.part1 = reseau_1
    new_reseau.part2 = reseau_2
    new_reseau.part3 = reseau_3
    #cidr
    new_reseau.cidr1 = reseau_cidr1
    new_reseau.cidr2 = reseau_cidr2
    #start
    new_reseau.start = reseau_start
    #end
    new_reseau.end = reseau_end
    #gateway
    new_reseau.gateway = reseau_gateway
    #dns
    new_reseau.dns1 = reseau_dns1
    new_reseau.dns2 = reseau_dns2
    new_reseau.dns3 = reseau_dns3
    new_reseau.dns4 = reseau_dns4
    new_reseau.reseau_list_id = reseau_list_id # Make the link between reseau and reseauList
    db.session.add(new_reseau)
    db.session.commit()
    return redirect(url_for("generate_form_reseau", config_idd=reseau_list_config_id, reseau_list_name=reseau_list_name))

@app.route("/delete_reseau/<reseau_list_id>/<reseau_id>")
def delete_reseau(reseau_list_id, reseau_id):
    from databaseProjet import  Reseau, ReseauList
    existing_reseau_list = ReseauList.query.filter_by(id=reseau_list_id).first()
    r_config_id=existing_reseau_list.config_id
    reseau_to_delete=Reseau.query.filter_by(id=reseau_id).first()
    existing_reseau_list_name=existing_reseau_list.name
    db.session.delete(reseau_to_delete)
    db.session.commit()
    return redirect(url_for("generate_form_reseau", config_idd=r_config_id, reseau_list_name=existing_reseau_list_name))

#Configuration des ordinateurs

@app.route("/name_computer/<config_id>")
def name_computer(config_id):
    from databaseProjet import Computer, ComputerList
    import random
    from datetime import date
    config=Config.query.filter_by(id=config_id).first()
    config.date_modification=date.today()
    db.session.commit()
    computer_list=ComputerList.query.filter_by(config_id=config_id).first()
    if computer_list is None:
        computer_list_name=random.random()
        return redirect(url_for("name_rolelist", config_id=config_id, computer_list_name=computer_list_name))
    computer_list_name=computer_list.name
    return redirect(url_for("name_rolelist", config_id=config_id, computer_list_name=computer_list_name))

@app.route("/name_rolelist/<config_id>/<computer_list_name>")
def name_rolelist(config_id, computer_list_name):
    from databaseProjet import RoleList
    import random
    role_list=RoleList.query.filter_by(config_id=config_id).first()
    if role_list is None:
        role_list_name=random.random()
        return redirect(url_for("generate_form_computer", config_id=config_id, computer_list_name=computer_list_name, role_list_name=role_list_name))
    role_list_name=role_list.name
    return redirect(url_for("generate_form_computer", config_id=config_id, computer_list_name=computer_list_name, role_list_name=role_list_name))
        
@app.route("/c/<config_id>/<computer_list_name>/<role_list_name>")
def generate_form_computer(config_id, computer_list_name, role_list_name):
    from databaseProjet import Computer, ComputerList, RoleList
    # If no "computer_list_name" parameter is provided, redirect to "default"
    if computer_list_name is None:
            return redirect(url_for("generate_form_computer", config_id=config_id, computer_list_name="default", role_list_name="default"))
    existing_computer_list = ComputerList.query.filter_by(name=computer_list_name).first()
    existing_role_list = RoleList.query.filter_by(name=role_list_name).first()
    # If no existing computer list, then create a new one
    if existing_computer_list is None:
        new_computer_list = ComputerList()
        new_computer_list.name = computer_list_name
        new_computer_list.config_id=config_id
        
        db.session.add(new_computer_list)
        db.session.commit()
        existing_computer_list = new_computer_list
        
    if existing_role_list is None:
        new_role_list = RoleList()
        new_role_list.name = role_list_name
        new_role_list.config_id=config_id
        
        db.session.add(new_role_list)
        db.session.commit()
        existing_role_list = new_role_list
    # Render the form usign the current computer list
    return render_template("editComputer.html", computer_list=existing_computer_list, role_list=existing_role_list)


@app.route("/form_handler_computer", methods=["POST"])
def form_handler_computer():
    from databaseProjet import Computer, RoleList, Role
    computer_list_id = request.form["computer_list_id"]
    computer_list_name = request.form["computer_list_name"]
    computer_list_config_id = request.form["computer_list_config_id"]
    computer_text = request.form["computer_text"]
    computer_role = request.form["computer_role"]
    computer_user = request.form["computer_user"]
    
    role_list_id = request.form["role_list_id"]
    role_list_name = request.form["role_list_name"]
    role_list_config_id = request.form["role_list_config_id"]
    
    # Create a new computer
    new_computer = Computer()
    new_computer.label = computer_text
    new_computer.role = computer_role
    new_computer.user = computer_user
    new_computer.computer_list_id = computer_list_id # Make the link between computer and computerList

    db.session.add(new_computer)
    db.session.commit()

    #create a new role if it did not exist already
    role_list=RoleList.query.filter_by(id=role_list_id).first()
    for role in role_list.roles:
        if role.role==new_computer.role:
             return redirect(url_for("generate_form_computer", config_id=computer_list_config_id, computer_list_name=computer_list_name, role_list_name=role_list.name))
    new_role= Role()
    new_role.role=computer_role
    new_role.role_list_id=role_list.id
    db.session.add(new_role)
    db.session.commit()
    return redirect(url_for("generate_form_computer", config_id=computer_list_config_id, computer_list_name=computer_list_name, role_list_name=role_list.name))

@app.route("/delete_computer/<computer_list_id>/<computer_id>/<role_list_id>")
def delete_computer(computer_list_id, computer_id, role_list_id):
    from databaseProjet import  Computer, ComputerList, Role, RoleList
    existing_computer_list = ComputerList.query.filter_by(id=computer_list_id).first()
    r_config_id=existing_computer_list.config_id
    computer_to_delete=Computer.query.filter_by(id=computer_id).first()
    role_computer=Role.query.filter_by(role=computer_to_delete.role).first()
    role_list=RoleList.query.filter_by(id=role_list_id).first()
    db.session.delete(computer_to_delete)
    db.session.commit()
    for computer in existing_computer_list.computers:
        if computer.role is role_computer:
            return redirect(url_for("generate_form_computer", config_id=r_config_id, computer_list_name=existing_computer_list.name, role_list_name=role_list.name))
    db.session.delete(role_computer)
    db.session.commit()
    return redirect(url_for("generate_form_computer", config_id=r_config_id, computer_list_name=existing_computer_list.name, role_list_name=role_list.name))


@app.route("/d/apercu_yaml/<config_id>")
def codeMirrorYaml(config_id):
    from databaseProjet import Config, ReseauList, ComputerList, RoleList
    config=Config.query.filter_by(id=config_id).first()
    reseau_list=ReseauList.query.filter_by(config_id=config_id).first()
    computer_list=ComputerList.query.filter_by(config_id=config_id).first()
    role_list=RoleList.query.filter_by(config_id=config_id).first()

    config_name=config.label
    return render_template("codeMirrorYaml.html", config_id=config_id, config_name=config_name, reseau_list=reseau_list, computer_list=computer_list, role_list=role_list)

@app.route("/delete_yaml/<config_id>")
def delete_yaml(config_id):
    from databaseProjet import Config
    existing_config = Config.query.filter_by(id=config_id).first()
    db.session.delete(existing_config)
    db.session.commit()
    return redirect(url_for('generate_form',config_list_name='default'))

if __name__ == "__main__":
#    # Create the DB
    from databaseProjet import db
    from databaseProjet import Config
    from databaseProjet import ConfigList
    from databaseProjet import Reseau
    from databaseProjet import ReseauList
    from databaseProjet import Computer
    from databaseProjet import ComputerList
    from databaseProjet import Role
    from databaseProjet import RoleList
    print("creating database")
    db.create_all()
    print("database created") 
    app.run(host="0.0.0.0", port=8080, debug=True)
    


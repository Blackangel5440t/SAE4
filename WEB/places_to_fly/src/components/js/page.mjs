import React from "react";
import { Link } from 'react-router-dom';
import account_light_mode from '../img/account-light-mode.png';
import PopupLikes from "./popup-likes.mjs";
import PopUpTrajet from "./popup-trajet.mjs";
import axios from "axios";

const baseURL = 'http://localhost:3000'

const villeDAO = {
    getVille : async (nom) => {
        const suffix = `/ville/${nom}`
        const res = await fetch(baseURL + suffix)
        const data = await res.json()
        return data
    } 
}

const userDAO = {
    like(username, email, password) {
        axios.post(`http://localhost:3000/like`, {
            login: username,
            email: email,
            password: password
        })
        .then(res => {
            sessionStorage.setItem("username", res.data.email)
            sessionStorage.setItem("password", res.data.password)
        })
    }
  }
  

function sessionSet() {
    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");
    return username != null && password != null
}

class Ville extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showTrajet: false,
        }
        this.addTrajet = this.addTrajet.bind(this)
    }

    toggleTrajetPopUp() {
        this.setState({
            showTrajet: !this.state.showTrajet
        });
    }

    addTrajet() {
        this.props.addTrajet(this.props.depart[0].nom, this.props.ville.nom, this.props.date)
    }

    render() {
        return (
            <article className="ville">
                <a>
                    <img className="image-ville" src={this.props.ville.image} alt={this.props.ville.nom}/>
                    <div className="ville-hover">
                        <div className="info-ville">
                            <h1 className="nom-ville">{this.props.ville.nom}</h1>
                            <p className="pays-ville">{this.props.ville.pays}</p>
                        </div>
                        <button onClick={this.toggleTrajetPopUp.bind(this)} className="popup-ville">Plus d'infos</button>
                        {this.state.showTrajet ? 
                            <PopUpTrajet closePopUp={this.toggleTrajetPopUp.bind(this)} addTrajetLike={this.addTrajet} depart={this.props.depart} date={this.props.date} ville={this.props.ville}/> : null    
                        }
                    </div>
                </a>
            </article>
        )
    }
}


class Header extends React.Component {
    constructor(props) {
        super(props)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.departChamp = this.departChamp.bind(this)
        this.dateChamp = this.dateChamp.bind(this)
        this.deconnectSession = this.deconnectSession.bind(this)
        this.state = {
            showPopUp: false
        }
    }

    dateChamp(e) {
        this.props.getDate(e.target.value)
    }

    departChamp(e) {
        if (e.key === "Enter") {
            this.props.getDepart(e.target.value)
        }
    }

    togglePopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp
        });
    }

    handleKeyUp(e) {
        if (e.key === "Enter") {
            this.props.onUpdate(e.target.value)
        }
    }

    deconnectSession() {
        sessionStorage.clear()
    }

    render() {
        const isSessionSet = sessionSet();
        return (
                <header>
                    <nav>
                        <div className="nav">
                            <span className="brand-name">Places to Fly</span>
                            <div className="informations-input">
                                <input type="text" id="depart" placeholder="Ville de départ" onKeyUp={this.departChamp}></input>
                                <input type="date" id="date" onChange={this.dateChamp}></input>                  
                                <input type="text" placeholder="Ville d'arrivée" onKeyUp={this.handleKeyUp}/>
                            </div>
                            <div className="compte-light-dark">
                                <div className="dropdown">
                                    <button className="dropbtn">
                                        <img src={account_light_mode} alt="Compte"/>
                                        <i className="fa fa-caret-down"></i>
                                    </button>
                                    <div className="dropdown-content">
                                        {isSessionSet ? (
                                            <><button onClick={this.togglePopUp.bind(this)} className="likes">Trajets Likés</button>
                                            {this.state.showPopUp ?
                                                <PopupLikes closePopUp={this.togglePopUp.bind(this)} trajet={this.props.trajet}/> : null
                                            }
                                            
                                            <button onClick={this.deconnectSession} className="like"><Link to="/">Déconnexion</Link></button></>
                                        )  : (
                                            <><Link to="/login">Connexion</Link><Link to="/signup">Inscription</Link></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
        )
    }
}

class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            query : "",
            villes : [],
            sticky: false,
            depart: [],
            date: "",
            trajet: []
        }
        this.doUpdate = this.doUpdate.bind(this);
        this.getDepart = this.getDepart.bind(this);
        this.getDate = this.getDate.bind(this)
    }

    componentDidMount() {
        this.doUpdate()
    }

    getDepart(query) {
        villeDAO.getVille(query).then(data => {
            if (!data.message) {
                this.setState({depart: [data]})
            }
        })
    }

    getDate(query) {
        this.setState({
            date: query
        })
    }

    doUpdate(query) {
        if (query != undefined) {
            this.setState({query: query})
        }
        
        if (this.state.query == "") {
            const capitales = ["Tokyo", "Seoul", "London", "Barcelona", "Bangkok", "Berlin", "Madrid", "Paris", "Vienna", "Rome", "New York", "Los Angeles", "Rio de Janeiro", "Montreal", "Sydney"];
            const stateCap = this.state.villes.map(x => x); 
            
            capitales.forEach(e => 
                villeDAO.getVille(e).then(data => {
                    stateCap.push(data)
                    if (stateCap.length == capitales.length) {
                        this.setState({villes: stateCap}, () => {})
                    }
                })
            )
        } else {
            villeDAO.getVille(query).then(data => {
                if (!data.message) {
                    this.setState({villes: [data]})
                } 
            })
        }
    }

    render() {
        const ville = this.state.villes.map(e =>  {
            return <Ville ville={e} key={e.nom} depart={this.state.depart} date={this.state.date} addTrajet={this.addTrajet}/>
        })
        return (
                <div className="page" id="light">
                    <Header onUpdate={this.doUpdate} getDepart={this.getDepart} getDate={this.getDate} trajet={this.state.trajet}/>
                    <section className="content">
                        {ville}
                    </section>
                </div>
        )
    }
}

export default MainPage;

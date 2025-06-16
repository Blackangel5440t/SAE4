import React from "react";
import "../style/index.css";
import close from "../img/close.png";
import notFound from "../img/notFound.png";
import axios from "axios";

const baseURL = 'http://localhost:3000'

const aeroportDAO = {
    getAeroportByVille : async (ville) => {
        const suffix = `/airports/${ville}`
        const res = await fetch(baseURL + suffix)
        const data = await res.json()
        return data
    },
    like(email, id) {
        axios.post(`http://localhost:3000/like` , {
            email: email,
            id: id
        })
    },
    getVol : async (icao, date, arrivee) => {
        const res = await fetch(baseURL + `/proposal/${icao}/${date}/${arrivee}`)
        const data = await res.json()
        return data
    }
}



class Monument extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <p>{this.props.monument}</p>
        )
    }
}

class Vol extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <p>{this.props.vol}</p>
        )
    }
}

class PopUpTrajet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            monumentDepart: [],
            monumentArrivee: [],
            villeDepart: "",
            imageVilleDepart: "",
            idAeroportDepart: [],
            vol: [],
            volId: [],
            date: ""
        }
        this.addTrajetLike = this.addTrajetLike.bind(this);
    }

    addTrajetLike() {
        aeroportDAO.like(sessionStorage.getItem("username"), this.state.volId[0])
    }


    componentDidMount() {
        this.getMonumentArrivee(this.props.ville.lieux)
        if (this.props.depart.length!==0) {
            this.getMonumentDepart(this.props.depart)
            this.getVol(this.props.depart[0].nom)
            this.setState({villeDepart: this.props.depart[0].nom})
            this.setState({imageVilleDepart: this.props.depart[0].image})
            this.setState({date: this.props.date})
        } else {
            this.setState({villeDepart: "Aucune ville de départ"})
            this.setState({imageVilleDepart: notFound})
        }
    }

    getVol(e) {
        let tab = []
        let element = []
        let elementVol = []
        let idVol = []
        let compagnie = []
        aeroportDAO.getAeroportByVille(e).then(data => {
            element = element.concat(data)
            for (let i=0; i<element.length; i++) {
                tab = tab.concat(element[i].id)
            }
            this.setState({idAeroportDepart: tab})
            aeroportDAO.getVol(tab[0], this.state.date, this.props.ville.nom).then(d => {
                elementVol = elementVol.concat(d)
                for (let j=0; j<elementVol.length; j++) {
                    compagnie = compagnie.concat(elementVol[j].airline)
                    idVol = idVol.concat(elementVol[j].id)
                }
                this.setState({volId: idVol})
                this.setState({vol: compagnie})
            })
        }) 
    }

    getMonumentDepart(e) {
        let tab1 = []
        let element = e[0].lieux
        for (var i=0; i<element.length; i++) {
            tab1 = tab1.concat(element[i].nom)
        }
        this.setState({monumentDepart: tab1})
    }

    getMonumentArrivee(e) {
        let tab1 = []
        for (var i=0; i<e.length; i++) {
            tab1 = tab1.concat(e[i].nom)
        }
        this.setState({monumentArrivee: tab1})
    }

    render() {
        const departMonument = this.state.monumentDepart.map(e => {
            return <Monument monument={e} key={e.nom}/>
        })

        const arriveeMonument = this.state.monumentArrivee.map(e => {
            return <Monument monument={e} key={e.nom}/>
        })

        let vols = ""
        if (this.state.vol[0] !== undefined) {
            vols = this.state.vol.map(e => {
                return <Vol vol={e} key={e.id}/>
            })
        } else {
            vols = "aucun vol entre les deux villes"
        }

        return (
            <div className="container-trajet">
                <div className="popup-trajet">
                    <div className="popup-inner">
                        <button className="close-btn" onClick={this.props.closePopUp}><img className="close-img" alt="close" src={close}/></button>
                        <h1>Trajet</h1>
                        <hr></hr>
                        <div className="popup-information">
                            <div className="popup-trajet-ville depart">
                                <h1>{this.state.villeDepart}</h1>
                                <img className="popup-image" src={this.state.imageVilleDepart}/>
                                <h2>Monuments</h2>
                                <div className="popup-monument">{departMonument}</div> 
                            </div>
                            <div className="popup-vol">
                                <h3>{this.props.date==="" ? "Aucune Date" : this.props.date}</h3>
                                <p>{vols}</p>
                                <button className="popup-add-like" onClick={this.addTrajetLike}>Liker ce trajet</button>
                            </div>
                            <div className="popup-trajet-ville arrivee">
                                <h1>{this.props.ville.nom}</h1>
                                <img className="popup-image" src={this.props.ville.image}/>
                                <h2>Monuments</h2>
                                <div className="popup-monument">{arriveeMonument}</div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        )
    } 
}

export default PopUpTrajet;

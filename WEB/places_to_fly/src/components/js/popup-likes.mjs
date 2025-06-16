import React from "react";
import "../style/index.css";
import close from '../img/close.png';

const baseURL = 'http://localhost:3000'

const userDAO = {
    getLike : async (email) => {
        const suffix = `/user/likes/${email}`
        const res = await fetch(baseURL + suffix)
        const data = await res.json()
        return data
    },
}

class PopUpLike extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            destinationLike : [],
            airlineLike: []
        }
    }

    componentDidMount() {
        this.getTrajetLike()
    }

    getTrajetLike() {
        let element = []
        let tab = []
        let tabAirline = []
        userDAO.getLike(sessionStorage.getItem("username")).then(data => {
            element = element.concat(data)
            for (let i=0; i<element.length; i++) {
                tab = tab.concat(element[i].destination)
                tabAirline = tabAirline.concat(element[i].airline)
            }
            this.setState({destinationLike: tab})
            this.setState({airlineLike: tabAirline})
        })
    }

    render() {
        const destLike = this.state.destinationLike.map(e => {
            return <h3>{e}</h3>
        })

        const airLike = this.state.airlineLike.map(e => {
            return<p>{e}</p>
        })

        return(
            <div className="container-like">
                <div className="popup-like">
                    <div className="popup-inner">
                        <button className="close-btn" onClick={this.props.closePopUp}><img className="close-img" alt="close" src={close}/></button>
                        <h1>Trajets Likés</h1>
                        <hr></hr>
                        <div className="popup-voyage">{destLike}{airLike}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopUpLike;

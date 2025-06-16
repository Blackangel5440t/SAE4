import React from "react";
import LogInForm from "./login-form.mjs";
import axios from 'axios';


const userDAO = {
    login : async (email) => {
        const suffix = `/user/${email}`
        const res = await fetch(`http://localhost:3000` + suffix)
        const data = await res.json()
        return data
    }
  }
  


class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                email: "",
                password: ""
            },
            btnShow: false,
            type: "password",
        };

        this.validateLogIn = this.validateLogIn.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.passwordMask = this.passwordMask.bind(this);
        this.passwordHandleChange = this.passwordHandleChange.bind(this)
    }

    submitLogin(user) {
        userDAO.login(user.email).then(data => {
            if (user.password === data.password) {
                sessionStorage.setItem("username", data.email)
                sessionStorage.setItem("password", data.password)
                return true
            }
        })
    }

    validateLogIn(event) {
        event.preventDefault();
        let cpt = 0
        if (this.state.user.password.length < 4) {
            document.getElementById('password').style.boxShadow = "0 0 0pt 2pt red";
        } else {
            document.getElementById('password').style.boxShadow = "";
            cpt++
        }

        if (cpt===1) {
            this.submitLogin(this.state.user)
            if (sessionStorage.getItem("password")===this.state.user.password) {
                window.location.href = "http://localhost:3001/"

            }
        }
    }
 
    passwordMask(event) {
        event.preventDefault();
        this.setState((state) =>
            Object.assign({}, state, {
                type: this.state.type === "password" ? "input" : "password",
                btnShow: this.state.btnShow === false ? true : false
            })
        )
    }

    handleChange(event) {
        const champ = event.target.name;
        const user = this.state.user;
        user[champ] = event.target.value;
        this.setState({
          user
        });
    }

    passwordHandleChange(event) {
        const champ = event.target.name;
        const user = this.state.user;
        user[champ] = event.target.value;
        this.setState({
            user
        });
    }

    render() {
        return (
            <div className="login" id="light">
                <LogInForm
                    onSubmit={this.validateLogIn}
                    onChange={this.handleChange}
                    user={this.state.user}
                    btnShow={this.state.btnShow}
                    type={this.state.type}
                    passwordMask={this.passwordMask}
                    onPasswordChange={this.passwordHandleChange}
                />
            </div>
        )
    }
}

export default Login;

import React from "react";
import SignUpForm from "./signup-form.mjs";
import axios from 'axios';

const userDAO = {
  register(username, email, password, token) {
      axios.post(`http://localhost:3000/user`, {
          login: username,
          email: email,
          password: password,
          token: token
      })
      .then(res => {
          sessionStorage.setItem("username", res.data.email)
          sessionStorage.setItem("password", res.data.password)
      })
  }
}

class Signup extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        user: {
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        },
        btnShow : false,
        type: "password",
      };
      this.handleChange = this.handleChange.bind(this);
      this.submitSignup = this.submitSignup.bind(this);
      this.validateSignUp = this.validateSignUp.bind(this);
      this.passwordMask = this.passwordMask.bind(this);
      this.passwordHandleChange = this.passwordHandleChange.bind(this);

    }

    submitSignup(user) {
      userDAO.register(user.username, user.email, user.password, "token")
    } 

    validateSignUp(event) {
      event.preventDefault();
      let cpt = 0
      if (typeof this.state.user.username !== "string") {
        document.getElementById('username').style.boxShadow = "0 0 0pt 2pt red";
      } else {
        document.getElementById('username').style.boxShadow = "";
        cpt++;
      }
      if (this.state.user.password.length < 4) {
        document.getElementById('password').style.boxShadow = "0 0 0pt 2pt red";
      } else {
        document.getElementById('password').style.boxShadow = "";
        cpt++;
      } 
      if (!(this.state.user.password==this.state.user.confirmPassword)) {
        document.getElementById('password').style.boxShadow = "0 0 0pt 2pt red";
        document.getElementById('confirmPassword').style.boxShadow = "0 0 0pt 2pt red";
      } else {
        document.getElementById('confirmPassword').style.boxShadow = "";
        cpt++;
      }
      
      
      if (cpt===3) {
        this.submitSignup(this.state.user)
        if (sessionStorage.getItem("password")===this.state.user.password && sessionStorage.getItem("username") === this.state.user.email) {
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



    render () {
        return (
            <div className="signup" id="light">
              <SignUpForm 
                onSubmit={this.validateSignUp}
                onChange={this.handleChange}
                erreurs={this.state.erreurs}
                user={this.state.user}
                btnShow={this.state.btnShow}
                type={this.state.type}
                passwordMask={this.passwordMask}
                onPasswordChange={this.passwordHandleChange}
              />
            </div>
        );
    }
}

export default Signup;

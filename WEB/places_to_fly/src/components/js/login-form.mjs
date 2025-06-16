import React from "react";
import { Link } from "react-router-dom";
import showPwdImg from '../img/showPassword.svg' 
import hidePwdImg from '../img/hidePassword.svg';

const LogInForm = ({
    history,
    onSubmit,
    onChange,
    user,
    btnShow,
    type,
    passwordMask,
    onPasswordChange
}) => {
    return (
        <div className="box">
            <Link to="/">Retour</Link>
            <div className="formulaire">
                <h1>Connexion</h1>
                <form onSubmit={onSubmit}>
                    <input type="email" name="email" id="email" value={user.email} placeholder="E-mail" onChange={onChange} required></input>
                    <div className="password-container">
                        <input type={type} name="password" id="password" value={user.password} placeholder="Mot de passe" onChange={onPasswordChange} required></input>
                        <img
                            title={btnShow ? "Cacher le mot de passe": "Montrer le mot de passe"}
                            src={btnShow ? hidePwdImg : showPwdImg}
                            onClick={passwordMask}
                        />
                    </div>
                    <button className="submitLogIn" type="submit">Se connecter</button>
                </form>
                <p>
                    Vous n'avez pas de compte ?
                    <br/>
                </p>
                <Link to="/signup">S'inscrire</Link>
            </div>
        </div>
    )
}

export default LogInForm;
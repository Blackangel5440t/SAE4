import React from "react";
import { Link } from "react-router-dom";
import showPwdImg from '../img/showPassword.svg' 
import hidePwdImg from '../img/hidePassword.svg';


const SignUpForm = ({
    history,
    onSubmit,
    onChange,
    erreurs,
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
                <h1>Inscription</h1>
                <form onSubmit={onSubmit}>
                    <input type="text" name="username" id="username" value={user.username} placeholder="Nom d'utilisateur" onChange={onChange} required></input>
                    <input type="email" name="email" id="email" value={user.email} placeholder="E-mail" onChange={onChange} required></input>
                    <div className="password-container">
                        <input type={type} name="password" id="password" value={user.password} placeholder="Mot de passe" onChange={onPasswordChange} required></input>
                        <img
                            title={btnShow ? "Cacher le mot de passe" : "Montrer le mot de passe"}
                            src={btnShow ? hidePwdImg : showPwdImg}
                            onClick={passwordMask}
                        />
                    </div>
                    <div className="password-container">
                        <input type={type} name="confirmPassword" id="confirmPassword" value={user.confirmPassword} placeholder="Confirmer le mot de passe" onChange={onChange} required></input>
                        <img
                            title={btnShow ? "Hide password" : "Show password"}
                            src={btnShow ? hidePwdImg : showPwdImg}
                            onClick={passwordMask}
                        />
                    </div>
                    
                   
                    <button className="submitSignUp" type="submit">S'inscrire</button>

                </form>
                <p>
                    Vous avez déjà un compte ? 
                    <br/>
                </p>
                <Link to="/login">Se connecter</Link>
            </div>
        </div>
    )
}

export default SignUpForm;
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Désolé</h1>
      <p>La page que vous demandez n'existe pas</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button><Link to="/">Revenir à la page d'accueil</Link></button>
    </div>
  );
}
import { Link } from "react-router-dom";
import "./AllLobbiesPage.scss";

function AllLobbiesPage() {
    return (
        <main className="all-lobbies">
            <Link className="all-lobbies__button" to="/lobby/1">Lobby 1</Link>
        </main>
    );
}

export default AllLobbiesPage;
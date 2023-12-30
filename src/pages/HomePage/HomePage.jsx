import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import stackedLogo from "../../assets/logos/ArcadeSurf-stacked-logo.png";
import "./HomePage.scss";

function HomePage() {
    const { userInfo } = useContext(UserContext);

    return (
        <>
            <main className="homepage">
                <img src={stackedLogo} alt="main logo" className="homepage__main-logo"/>
                <div className="homepage__hero-column"></div>
            </main>
            <section className="games-list">
                <h2 className="games-list__title">Play a game!</h2>
                <Link to="/lobby/1" className="games-list__link">
                    Multiplayer Match
                </Link>
                <Link to="/create-lobby" className="games-list__link">
                    Create a Lobby
                </Link>
            </section>
        </>
    );
}

export default HomePage;
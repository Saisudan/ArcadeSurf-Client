import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

function HomePage() {
    const { userInfo } = useContext(UserContext);

    return (
        <>
            <main className="homepage">
                <h1 className="homepage__title">Welcome to ________</h1>
                <div className="homepage__hero-column">
                    <Link className="homepage__hero-button" to="/lobby">Join a game!</Link>
                    { userInfo && <button className="homepage__hero-button">Create a lobby!</button> }
                </div>
            </main>
            <section className="games-list">
                <h2 className="games-list__title">Pick a game to play!</h2>
                {/* map over games list, display cards */}
            </section>
        </>
    );
}

export default HomePage;
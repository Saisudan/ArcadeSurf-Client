import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../App";
import headerLogo from "../../assets/logos/ArcadeSurf-medium-logo_transparent.png";
import "./Header.scss";

const myAPI = process.env.REACT_APP_EXPRESS_SERVER_URL;

function Header() {
    const [ userAuth, setUserAuth ] = useState("Checking...");
    const { userInfo, setUserInfo } = useContext(UserContext);
    const { pathname } = useLocation();
    const navigator = useNavigate();
    const token = localStorage.getItem("token");

    // Check if the user is logged in
    useEffect(() => {

        async function checkAuth() {
            try {
                const authResponse = await axios.get(`${myAPI}/users/my-info`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserInfo(authResponse.data);
                setUserAuth("Authenticated");
            } catch (error) {
                setUserInfo(null);
                setUserAuth("Error checking auth");
            }
        }
    
        if (!token) {
            // User isn't logged in
            setUserInfo(null);
            setUserAuth("Unauthenticated");
        } else {
            checkAuth();
        }
      }, [token, pathname, setUserInfo]);

    function logout() {
        localStorage.removeItem("token");
        setUserInfo(null);
        setUserAuth("Unauthenticated");
        navigator("/");
    }

    return (
        <header className="header">
            <Link className="header__logo-link" to="/">
                <img src={headerLogo} alt="Site Logo" className="header__logo"/>
            </Link>
            <nav className="header__nav">
                {
                    userAuth === "Checking..." ? "" : (
                        <div className="header__auth-wrapper">
                            {
                                userAuth === "Authenticated" ? (
                                    <>
                                        <p className="header__username">{userInfo.username}</p>
                                        <p className="header__nav-button" onClick={logout}>Logout</p>
                                    </>
                                ) : (
                                    <>
                                        <Link className="header__nav-button" to="/login">Login</Link>
                                        <Link className="header__nav-button header__nav-button--alt" to="/signup">Signup</Link>
                                    </>
                                )
                            }
                        </div>
                    )
                }
            </nav>
        </header>
    );
}

export default Header;
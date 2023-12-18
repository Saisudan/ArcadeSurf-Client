import "./Footer.scss";
import footerLogo from "../../assets/logos/ArcadeSurf-long-logo.png";

function Footer(props) {
    return (
        <footer className="footer">
            <img src={footerLogo} alt="footer logo" className="footer__image" />
        </footer>
    );
}

export default Footer;
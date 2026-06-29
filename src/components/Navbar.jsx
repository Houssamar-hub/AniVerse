// components/Navbar.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navLinks = [
        { path: "/", label: "HOME" },
        { path: "/anime", label: "ANIME" },
        { path: "/characters", label: "CHARACTERS" },
        { path: "/favorites", label: "FAVORITES" },
        { path: "/my-library", label: "MY LIBRARY" },
        { path: "/my-ratings", label: "MY RATINGS" },
        { path: "/dashboard", label: "DASHBOARD" },
    ];

    return (
        <nav id="navbar">
            <div className="nav-container">
                {/* Logo */}
                <div
                    onClick={() => {
                        navigate("/");
                        closeMenu();
                    }}
                    className="logo"
                >
                    <span className="bebas logo-ani">Ani</span>
                    <span className="bebas logo-verse">Verse</span>
                    <span className="logo-dot"></span>
                </div>

                {/* Desktop Navigation */}
                <div className="desktop-nav">
                    {navLinks.map((link) => (
                        <span
                            key={link.path}
                            className={`nav-pill ${isActive(link.path) ? "active" : ""}`}
                            onClick={() => navigate(link.path)}
                        >
                            {link.label}
                        </span>
                    ))}
                </div>

                {/* Hamburger Icon - Mobile */}
                <div className="hamburger" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                {navLinks.map((link) => (
                    <span
                        key={link.path}
                        className={`mobile-nav-pill ${isActive(link.path) ? "active" : ""}`}
                        onClick={() => {
                            navigate(link.path);
                            closeMenu();
                        }}
                    >
                        {link.label}
                    </span>
                ))}
            </div>
        </nav>
    );
}

export default Navbar;
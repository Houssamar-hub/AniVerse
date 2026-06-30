// components/LoadingSpinner.jsx
import { FaSpinner } from 'react-icons/fa';
import '../styles/LoadingSpinner.css';

function LoadingSpinner({ message = 'Loading...', size = 'medium' }) {
    return (
        <div className={`loading-container ${size}`}>
            <div className="loading-spinner-wrapper">
                <FaSpinner className="loading-spinner-icon" />
                <div className="loading-ring"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
}

export default LoadingSpinner;
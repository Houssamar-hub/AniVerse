// pages/MyLibrary.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaBook, FaStar, FaTrash, FaClock, FaCheck, 
    FaPlay, FaEye, FaBookOpen, FaArrowLeft,
    FaEyeSlash, FaFilter
} from 'react-icons/fa';
import { useLibraryContext } from '../context/LibraryContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/MyLibrary.css';

function MyLibrary() {
    const navigate = useNavigate();
    const {
        library,
        loading,
        error,
        filter,
        setFilter,
        removeFromLibrary,
        updateLibraryStatus,
        loadLibrary,
        getStatusCounts,
        getFilteredLibrary
    } = useLibraryContext();

    const [removingId, setRemovingId] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const filteredLibrary = getFilteredLibrary();
    const counts = getStatusCounts();

    const statusOptions = [
        { value: 'plan_to_watch', label: 'Plan to Watch', icon: <FaClock /> },
        { value: 'watching', label: 'Watching', icon: <FaPlay /> },
        { value: 'completed', label: 'Completed', icon: <FaCheck /> }
    ];

    const statusLabels = {
        plan_to_watch: 'Plan to Watch',
        watching: 'Watching',
        completed: 'Completed'
    };

    const statusColors = {
        plan_to_watch: 'status-plan',
        watching: 'status-watching',
        completed: 'status-completed'
    };

    const handleRemove = async (id) => {
        setRemovingId(id);
        const result = await removeFromLibrary(id);
        setRemovingId(null);
        if (!result.success) {
            alert(result.message);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const result = await updateLibraryStatus(id, newStatus);
        setShowStatusModal(null);
        setSelectedItem(null);
        if (!result.success) {
            alert(result.message);
        }
    };

    const handleRetry = () => {
        loadLibrary();
    };

    if (loading) {
        return <LoadingSpinner message="Loading library..." size="large" />;
    }

    if (error && library.length === 0) {
        return (
            <div className="library-error-container">
                <div className="library-error-icon">⚠️</div>
                <h2>{error}</h2>
                <button onClick={handleRetry} className="library-retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="library-page">
            <div className="library-header">
                <h1 className="library-title">
                    <FaBook className="library-icon" />
                    My Library
                </h1>
                <span className="library-count">{library.length} anime</span>
            </div>

            {/* Status Filters */}
            <div className="library-filters">
                <button
                    className={`library-filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    <FaBookOpen />
                    All ({counts.all})
                </button>
                <button
                    className={`library-filter-btn ${filter === 'plan_to_watch' ? 'active' : ''}`}
                    onClick={() => setFilter('plan_to_watch')}
                >
                    <FaClock />
                    Plan to Watch ({counts.plan_to_watch})
                </button>
                <button
                    className={`library-filter-btn ${filter === 'watching' ? 'active' : ''}`}
                    onClick={() => setFilter('watching')}
                >
                    <FaPlay />
                    Watching ({counts.watching})
                </button>
                <button
                    className={`library-filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    <FaCheck />
                    Completed ({counts.completed})
                </button>
            </div>

            {filteredLibrary.length === 0 ? (
                <div className="library-empty-state">
                    <div className="library-empty-icon">📚</div>
                    <h3>
                        {filter === 'all' 
                            ? 'Your library is empty' 
                            : `No anime with status "${statusLabels[filter]}"`}
                    </h3>
                    <p>
                        {filter === 'all'
                            ? 'Start adding anime to your personal library.'
                            : 'Try changing the filter or add some anime.'}
                    </p>
                    <button onClick={() => navigate('/anime')} className="library-empty-btn">
                        Browse Anime
                    </button>
                </div>
            ) : (
                <div className="library-grid">
                    {filteredLibrary.map((item) => (
                        <div key={item.id} className="library-card">
                            <div 
                                className="library-card-image"
                                onClick={() => navigate(`/anime/${item.mal_id}`)}
                            >
                                <img 
                                    src={item.images?.jpg?.image_url} 
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x400/1a1a2e/666?text=No+Image';
                                    }}
                                />
                                <div className={`library-card-status ${statusColors[item.status]}`}>
                                    {statusLabels[item.status]}
                                </div>
                            </div>
                            
                            <div className="library-card-content">
                                <h3 
                                    className="library-card-title"
                                    onClick={() => navigate(`/anime/${item.mal_id}`)}
                                >
                                    {item.title}
                                </h3>
                                
                                <div className="library-card-info">
                                    <span className="library-card-score">
                                        <FaStar className="library-star" />
                                        {item.score || 'N/A'}
                                    </span>
                                    <span className="library-card-episodes">
                                        {item.episodes || '?'} eps
                                    </span>
                                </div>

                                <div className="library-card-actions">
                                    <button 
                                        className="library-card-status-btn"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setShowStatusModal(item.id);
                                        }}
                                    >
                                        <FaFilter /> Change Status
                                    </button>
                                    <button 
                                        className="library-card-remove"
                                        onClick={() => handleRemove(item.id)}
                                        disabled={removingId === item.id}
                                    >
                                        {removingId === item.id ? (
                                            <span>Removing...</span>
                                        ) : (
                                            <FaTrash />
                                        )}
                                    </button>
                                </div>

                                <div className="library-card-added">
                                    Added: {new Date(item.addedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Status Change Modal */}
            {showStatusModal && selectedItem && (
                <div className="library-modal-overlay" onClick={() => setShowStatusModal(null)}>
                    <div className="library-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Change Status</h3>
                        <p>Update status for "{selectedItem.title}"</p>
                        <div className="library-modal-options">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    className={`library-modal-option ${selectedItem.status === option.value ? 'active' : ''}`}
                                    onClick={() => handleStatusChange(selectedItem.id, option.value)}
                                >
                                    {option.icon}
                                    {option.label}
                                    {selectedItem.status === option.value && <FaCheck className="library-modal-check" />}
                                </button>
                            ))}
                        </div>
                        <button 
                            className="library-modal-cancel"
                            onClick={() => setShowStatusModal(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyLibrary;
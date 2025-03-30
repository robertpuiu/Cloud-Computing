import Recommendations from '../components/Recommendations';
import { useState, useEffect } from 'react';

function RecommendationSection({
  songs,
  playlists,
  onAddToPlaylist,
  onViewDetails,
}) {
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Since we don't have a real recommendations endpoint in the provided
        // backend, we'll simulate this by getting random songs
        if (songs.length > 0) {
          // Randomly select up to 5 songs
          const shuffled = [...songs].sort(() => 0.5 - Math.random());
          const recommendations = shuffled.slice(
            0,
            Math.min(5, shuffled.length)
          );
          setRecommendedSongs(recommendations);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [songs]);

  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="error">Error loading recommendations: {error}</div>;
  }

  return (
    <div className="recommendations-section">
      <h2>Recommended Songs</h2>
      <Recommendations
        songs={recommendedSongs}
        playlists={playlists}
        onAddToPlaylist={onAddToPlaylist}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}

export default RecommendationSection;

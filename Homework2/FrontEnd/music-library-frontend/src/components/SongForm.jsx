import { useState } from 'react';

function SongForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    artist: initialData.artist || '',
    album: initialData.album || '',
    genre: initialData.genre || '',
    duration: initialData.duration || '',
    year: initialData.year || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === 'duration' || name === 'year'
          ? value === ''
            ? ''
            : parseInt(value, 10)
          : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.artist.trim()) newErrors.artist = 'Artist is required';

    if (
      formData.duration !== '' &&
      (isNaN(formData.duration) || formData.duration < 0)
    ) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (formData.year !== '' && (isNaN(formData.year) || formData.year < 0)) {
      newErrors.year = 'Year must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const cleanedData = { ...formData };
      Object.keys(cleanedData).forEach((key) => {
        if (cleanedData[key] === '') {
          delete cleanedData[key];
        }
      });

      onSubmit(cleanedData);

      if (!initialData.title) {
        setFormData({
          title: '',
          artist: '',
          album: '',
          genre: '',
          duration: '',
          year: '',
        });
      }
    }
  };

  return (
    <form className="song-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="artist">Artist *</label>
        <input
          type="text"
          id="artist"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          className={errors.artist ? 'error' : ''}
        />
        {errors.artist && (
          <span className="error-message">{errors.artist}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="album">Album</label>
        <input
          type="text"
          id="album"
          name="album"
          value={formData.album}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="genre">Genre</label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (seconds)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className={errors.duration ? 'error' : ''}
          min="0"
        />
        {errors.duration && (
          <span className="error-message">{errors.duration}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="year">Year</label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className={errors.year ? 'error' : ''}
          min="0"
        />
        {errors.year && <span className="error-message">{errors.year}</span>}
      </div>

      <div className="form-buttons">
        <button type="submit">
          {initialData.title ? 'Update' : 'Add'} Song
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default SongForm;


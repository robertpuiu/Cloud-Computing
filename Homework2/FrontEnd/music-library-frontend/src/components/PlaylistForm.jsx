import { useState } from 'react';

function PlaylistForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Playlist name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // If editing, preserve the songs array
      const submitData = { ...formData };
      if (initialData.songs) {
        submitData.songs = initialData.songs;
      }

      onSubmit(submitData);

      if (!initialData.name) {
        setFormData({
          name: '',
          description: '',
        });
      }
    }
  };

  return (
    <form className="playlist-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Playlist Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>

      <div className="form-buttons">
        <button type="submit">
          {initialData.name ? 'Update' : 'Create'} Playlist
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

export default PlaylistForm;


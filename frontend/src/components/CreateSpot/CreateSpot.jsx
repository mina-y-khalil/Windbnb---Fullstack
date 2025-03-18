import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spot';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateSpot.css';
function CreateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [images, setImages] = useState(['', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(false);
    setErrors({});

    const formErrors = {};

    if (!country) formErrors.country = 'Country is required';
    if (!address) formErrors.address = 'Address is required';
    if (!city) formErrors.city = 'City is required';
    if (!state) formErrors.state = 'State is required';
    if (!description || description.length < 30)
      formErrors.description = 'Description needs 30 or more characters';
    if (!name) formErrors.name = 'Name is required';
    if (!price) formErrors.price = 'Price per night is required';
    if (!previewImage) formErrors.previewImage = 'Preview Image URL is required';
    const isValidImageUrl = (url) => /^https?:\/\/.*\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(url);

    if (!isValidImageUrl(previewImage)) {
      formErrors.previewImage =
        'Preview Image URL must be a valid image link (jpg, jpeg, png, gif)';
    }


    images.forEach((image, index) => {
      if (image && !isValidImageUrl(image)) {
        formErrors[`image${index + 1}`] = `Image ${index + 1} URL must be valid`;
      }
    });
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    const newSpot = {
      country,
      address,
      city,
      state,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      description,
      name,
      price: price ? parseFloat(price) : null,
    };

    const imageUrls = [previewImage, ...images.filter((url) => url.trim() !== '')];
    console.log("Sending Spot Data:", newSpot);
    try {
      const createdSpot = await dispatch(createSpot(newSpot, imageUrls));
      navigate(`/spots/${createdSpot.id}`);
    } catch (err) {
      console.error('Error creating spot:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="create-spot-container">
      <h1>Create a new spot</h1>
      <form onSubmit={handleSubmit} className="create-spot-form">
        <div className="form-section">
          <h3>Wheres your place located?</h3>
          <p style={{ color: 'black' }}>Guests will only get your exact address once they booked a reservation.</p>
          <label>Country
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
          </label>
          {errors.country && <p className="error-text">{errors.country}</p>}
          <label>Street Address
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
          </label>
          {errors.address && <p className="error-text">{errors.address}</p>}
          <label>City
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
          </label>
          {errors.city && <p className="error-text">{errors.city}</p>}
          <label>State
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
          </label>
          {errors.state && <p className="error-text">{errors.state}</p>}
          <div className="lat-lng-container">
            <label>Latitude (optional)
              <input type="number" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" />
            </label>
            <label>Longitude (optional)
              <input type="number" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Describe your place to guests</h3>
          <p style={{ color: 'black' }}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
          />
          {errors.description && <p className="error-text">{errors.description}</p>}
        </div>

        <div className="form-section">
          <h3>Create a title for your spot</h3>
          <p style={{ color: 'black' }}>Catch guests attention with a spot title that highlights what makes your place special.</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-section">
          <h3>Set a base price for your spot</h3>
          <p style={{ color: 'black' }}>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
          />
          {errors.price && <p className="error-text">{errors.price}</p>}
        </div>

        <div className="form-section">
          <h3>Liven up your spot with photos</h3>
          <p style={{ color: 'black' }}>Submit a link to at least one photo to publish your spot.</p>
          <label>Preview Image URL
            <input
              type="text"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="Preview Image URL"
            />
          </label>
          {errors.previewImage && <p className="error-text">{errors.previewImage}</p>}
          {images.map((image, index) => (
            <label key={index}>
              Image URL
              <input
                type="text"
                value={image}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = e.target.value;
                  setImages(newImages);
                }}
                placeholder="Image URL"
              />
              {errors[`image${index + 1}`] && <p className="error-text">{errors[`image${index + 1}`]}</p>}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="create-spot-button"
          disabled={isSubmitting}>
          {isSubmitting ? "Creating Spot..." : "Create Spot"}
        </button>
      </form>
    </div>
  );
}

export default CreateSpot;
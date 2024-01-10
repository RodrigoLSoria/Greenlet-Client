import React, { useState, useRef, useEffect, useCallback } from 'react'
import { GoogleMap, Marker, Circle, useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import "./Maps.css"


const libraries = ['places']


const Maps = ({ initialCenter, radius, onRadiusChange, onPlaceSelected }) => {
    const radiusOptions = [
        { radius: 1000, zoom: 16 },
        { radius: 5000, zoom: 14 },
        { radius: 20000, zoom: 12 },
        { radius: 100000, zoom: 10 },
        { radius: 200000, zoom: 8 },
        { radius: 'No limit', zoom: 4 },
    ]
    const [center, setCenter] = useState(initialCenter)
    const [zoom, setZoom] = useState(radiusOptions[0].zoom)
    const autocompleteRef = useRef(null)

    const containerStyle = {
        width: '100%',
        height: '275px',
    }

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    })

    const onPlaceChanged = useCallback(() => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            const location = place.geometry.location;
            const newCenter = { lat: location.lat(), lng: location.lng() };
            setCenter(newCenter);
            onPlaceSelected(newCenter);
        }
    }, [onPlaceSelected])

    useEffect(() => {
        const selectedOption = radiusOptions.find(option => option.radius === radius)
        if (selectedOption) {
            setZoom(selectedOption.zoom)
        }
    }, [radius])

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    const handleRadiusSelect = (selectedRadius) => {
        console.log('Selected radius:', selectedRadius)
        onRadiusChange(selectedRadius)
    }

    const onAutocompleteLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    }

    return (
        <>
            {/* <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
            >
                <input
                    type="text"
                    placeholder="Search places..."
                    className="input"
                />
            </Autocomplete> */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
            >
                <Marker position={center} />
                <Circle
                    center={center}
                    radius={typeof radius === 'number' ? radius : 0}
                    options={{
                        strokeColor: "blue",
                        strokeOpacity: 0.35,
                        strokeWeight: 2,
                        fillColor: "blue",
                        fillOpacity: 0.35,
                        visible: radius !== 'No limit'
                    }}
                />
            </GoogleMap>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                {radiusOptions.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleRadiusSelect(option.radius)}
                        className={`radius-button ${radius === option.radius ? 'selected' : ''}`}
                    >
                        {option.radius === 'No limit' ? option.radius : `${option.radius / 1000}km`}
                    </button>
                ))}
            </div>
        </>
    )
}

export default Maps

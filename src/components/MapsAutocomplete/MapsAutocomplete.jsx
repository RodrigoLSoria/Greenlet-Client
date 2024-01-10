import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Geocode from "react-geocode";



const MapsAutocomplete = ({ onLocationSelect }) => {
    const [value, setValue] = useState()
    console.log("laKey", import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

    useEffect(() => {
        Geocode.setApiKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)



        if (value) {
            Geocode.fromAddress(value.label)
                .then(response => {
                    const { lat, lng } = response.results[0].geometry.location
                    onLocationSelect({ lat, lng, address: value.label })
                })
                .catch(error => {
                    console.error("Error fetching geocode:", error)
                });
        }
    }, [value, onLocationSelect])


    return (
        <div>
            <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                selectProps={{
                    value,
                    onChange: setValue,
                }}
            />
        </div>
    );
}

export default MapsAutocomplete
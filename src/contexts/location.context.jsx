import { createContext, useContext, useState, useEffect } from 'react';
import setGeolocation from '../utils/setGeolocation'
import mapsService from '../services/maps.services';


const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState('');

    const loadGeolocation = () => {
        setGeolocation(
            (position) => {
                const { latitude, longitude } = position;
                console.log("así me llega la position", position)
                mapsService.reverseGeocode(latitude, longitude)
                    .then(locationData => {
                        setLocation(`${locationData.data.city}, ${locationData.data.country}`);
                    })
                    .catch(console.error);
            },
            (error) => {
                console.error('Error fetching geolocation:', error);
            }
        );
    };


    useEffect(() => {
        loadGeolocation();
    }, []);

    return (
        <LocationContext.Provider value={{ location, loadGeolocation }}>
            {children}
        </LocationContext.Provider>
    );
};

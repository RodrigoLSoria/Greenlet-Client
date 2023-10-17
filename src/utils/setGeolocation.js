const setGeolocation = (onSuccess, onError) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                onSuccess({ latitude, longitude });
            },
            (error) => {
                console.error('Error occurred while getting user location:', error);
                onError(error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        onError(new Error('Geolocation is not supported by this browser.'));
    }
};

export default setGeolocation;
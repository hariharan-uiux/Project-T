import * as Location from 'expo-location';

export const getWeather = async () => {
    try {
        // Request permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return { error: 'Permission to access location was denied' };
        }

        // Get location
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Fetch weather from OpenMeteo (Free, no key required)
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );
        const data = await response.json();

        if (!data.current) {
            throw new Error("Weather data not found");
        }

        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const condition = getWeatherCondition(code);

        return { temp, condition };
    } catch (error) {
        console.log("Error fetching weather:", error.message);
        return { error: error.message };
    }
};

// Helper to map WMO codes to descriptions
const getWeatherCondition = (code) => {
    if (code === 0) return 'Clear';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Cloudy';
};

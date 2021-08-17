import React, { useState } from 'react';

import { fetchWeather } from './api/fetchWeather';
import './App.css';

const App = () => {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});

    const search = async (e) => {
        if (e.key === 'Enter') {
            const data = await fetchWeather(query);  //api den gelen data ya atanır

            //console.log(data);

            setWeather(data);
            setQuery(''); //input tekrar arama için yenilenir temizlenir
        }
    }

    return (
        <div className="main-container">
            <input type="text"
                className="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={search}  //enter => search çalışır
            />

            {/*  // / main - container  dan gelen data ları kullanmak için {weather.main && ()} kullanılır */}
            {/* //weather api den gelir */}

            {weather.main && (
                <div className="city">

                    <h2 className="city-name">
                        <span>{weather.name}</span>
                        {/* //sup elementi ile şehrin ülkesini kısaltarak yazarız */}
                        <sup>{weather.sys.country}</sup>
                    </h2>

                    <div className="city-temp">
                        {Math.round(weather.main.temp)}
                        <sup>&deg;C</sup>
                    </div>

                    <div className="info">
                        <img className="city-icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
                        <p>{weather.weather[0].description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

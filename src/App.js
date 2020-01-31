import React, { useState, useEffect } from "react";
import { Route, Switch, NavLink, withRouter } from "react-router-dom";
import axios from "axios";
import "./App.css";
import HomePage from "./component/HomePage";
import FavoritesPage from "./component/FavoritesPage";

import currentMockData from "./data/current.json";
import daysMockData from "./data/days.json";

// http://dataservice.accuweather.com/locations/v1/cities/search?apikey=hM9A9giejd42ZXlXZbVtmv9ZwPWBvKY5&q=eilat
const accessKey = "UUDMUFRq5G9sLGeDSAq2iwub59kFw5Hx";

function getCurrentWeather(key) {
   return axios(
      `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${accessKey}`
   );
}
function getFiveDailyForecasts(key) {
   return axios(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=${accessKey}`
   );
}

function getQueryParam(name) {
   const urlParams = new URLSearchParams(window.location.search);
   const value = urlParams.get(name);
   return value;
}

function App(props) {
   const [cityName, setCityName] = useState("tel aviv");
   const [apikey, setApiKey] = useState("215854");
   const [currentCityData, setCurrentCityData] = useState(null);
   const [fiveDays, setFiveDay] = useState([]);
   const [favorites, setFavorites] = useState([]);

   const keyUrl = getQueryParam("key");
   const cityNameUrl = getQueryParam("cityName");

   useEffect(() => {
      if (keyUrl) {
         updateFromLink(keyUrl, cityNameUrl);
      }
   }, [keyUrl]);

   useEffect(() => {
      getCurrentWeather(apikey)
         .then(res => {
            setCurrentCityData(res.data[0]);
         })
         .catch(err => {
            console.log("error get getCurrentWeather", err.message);
            setCurrentCityData(currentMockData); // for dev only
         });

      getFiveDailyForecasts(apikey)
         .then(res => {
            console.log("succes getFiveDailyForecasts", res);
            setFiveDay(res.data.DailyForecasts);
         })
         .catch(err => {
            console.log("error get getFiveDailyForecasts", err.message);
            setFiveDay(daysMockData); // dev only - data from file json
         });
   }, []);

   const onCityChange = city => {
      const { LocalizedName, Key } = city;
      setCityName(LocalizedName);
      setApiKey(Key);
      getCurrentWeather(Key)
         .then(res => {
            setCurrentCityData(res.data[0]);
         })
         .catch(err => {
            console.log("error get getCurrentWeather", err.message);
            setCurrentCityData(currentMockData); // for dev only
         });
      getFiveDailyForecasts(Key)
         .then(res => {
            console.log("succes getFiveDailyForecasts", res);
            setFiveDay(res.data.DailyForecasts);
         })
         .catch(err => {
            console.log("error get getFiveDailyForecasts", err.message, daysMockData);
            setFiveDay(daysMockData); // dev only - data from file json
         });
   };

   const isInFavorites = favorites.find(favorite => favorite.apikey === apikey);

   const addToFavorite = () => {
      if (isInFavorites) {
         // remove from
         setFavorites(favorites.filter(favorite => favorite.apikey !== apikey));
      } else {
         // add to faroties
         setFavorites([...favorites, { apikey, cityName, currentCityData }]);
      }
   };

   const updateFromLink = (key, cityName) => {
      setCityName(cityName);
      setApiKey(key);
      getCurrentWeather(key)
         .then(res => {
            setCurrentCityData(res.data[0]);
         })
         .catch(err => {
            console.log("error get getCurrentWeather", err.message);
            setCurrentCityData(currentMockData); // for dev only
         });
      getFiveDailyForecasts(key)
         .then(res => {
            console.log("succes getFiveDailyForecasts", res);
            setFiveDay(res.data.DailyForecasts);
         })
         .catch(err => {
            console.log("error get getFiveDailyForecasts", err.message, daysMockData);
            setFiveDay(daysMockData); // dev only - data from file json
         });
   };

   // if not currentCityData, display loading
   if (!currentCityData) return <div>Loading...</div>;

   return (
      <div className="App">
         <div className="header">
            <div>Weather Task</div>
            <div>
               <NavLink to="/">Home</NavLink>
               <NavLink to="/favorites">Favorites</NavLink>
            </div>
         </div>
         <div className="main">
            <Switch>
               <Route
                  path="/"
                  exact
                  component={props => (
                     <HomePage
                        {...props}
                        onCityChange={onCityChange}
                        accessKey={accessKey}
                        fiveDays={fiveDays}
                        updateFromLink={updateFromLink}
                        addToFavorite={addToFavorite}
                        cityName={cityName}
                        currentCityData={currentCityData}
                        isInFavorites={isInFavorites}
                     />
                  )}
               />
               <Route
                  path="/favorites"
                  exact
                  component={props => <FavoritesPage {...props} favorites={favorites} />}
               />
            </Switch>
         </div>
      </div>
   );
}

export default withRouter(App);

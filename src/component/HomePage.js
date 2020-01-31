import React, { useState, useEffect } from "react";
import axios from "axios";

import dataMock from "../data/auto.json";

const days = ["sunday", "modday", "thusday", "wendsaday", "thurday", "firday", "sutartday"];

function currentDay() {
   var d = new Date();
   var n = d.getDay();
   return n;
}

function getAutoSearch(accessKey, text) {
   //////////////////////////get auotcomplet????
   return axios(
      `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${accessKey}&q=${text}`
   );
}

function toFahrenheit(c) {
   return (c - 32) / 1.8;
}

export default function HomePage(props) {
   const {
      fiveDays,
      onCityChange,
      accessKey,
      currentCityData,
      cityName,
      isInFavorites,
      addToFavorite
   } = props;

   const [searchText, setSearchText] = useState("");
   const [cities, setCities] = useState([]);
   const [isOpen, setIsOpen] = useState(false);

   const onSearchChange = event => {
      const { value } = event.target;
      setSearchText(value);
   };
   const getAutoComplete = () => {
      setIsOpen(true);
      getAutoSearch(accessKey, searchText) //////////////////////////get auotcomplet????
         .then(res => {
            console.log("success", res);
            setCities(res.data);
         })
         .catch(err => {
            console.log(err.message);
            setCities(dataMock);
         });
   };

   const onCityClick = city => {
      setIsOpen(false);
      onCityChange(city);
   };

   

   if (fiveDays.length == 0) return "loading....";

   return (
      <div>
         <div className="homebar">
            <p>
               {cityName} {currentCityData.Temperature.Metric.Value}
            </p>
            <button onClick={addToFavorite}>
               {isInFavorites ? "Remove from " : "Add to"} Favorites
            </button>
            {isInFavorites ? (
               <i class="fas fa-heart" style={{ "font-size": "15px", color: "red" }}></i>
            ) : (
               ""
            )}
         </div>
         <div>
            <input onChange={onSearchChange} placeholder="search city.." />

            <button onClick={getAutoComplete}> 
              search</button>
            {isOpen && (
               <div className="list">
                  {cities.map((city, i) => {
                     return (
                        <div key={i} className="item" onClick={() => onCityClick(city)}>
                           {city.LocalizedName}
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
         <div className="forecastList">
            {fiveDays.map((day, i) => {
               const { Temperature } = day;
               const dayIndex = (currentDay() + i) % 7;
               return (
                  <div className="forecastItem" on>
                     <p>{days[dayIndex]}</p>
                     <p>
                        {toFahrenheit(Temperature.Minimum.Value).toFixed(1)}
                        <br />
                        {toFahrenheit(Temperature.Maximum.Value).toFixed(1)}C
                     </p>
                  </div>
               );
            })}
         </div>
         <div></div>
      </div>
   );
}

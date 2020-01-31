import React from "react";
import { NavLink } from "react-router-dom";

export default function FavoritesPage(props) {
   const { favorites } = props;
   return (
      <div>
         <h1>header</h1>
         <div className="forecastList">
            {favorites.map((favorite, i) => {
               return (
                  <NavLink key={i} to={`/?key=${favorite.apikey}&cityName=${favorite.cityName}`}>
                     <div className="forecastItem">
                        <p>{favorite.cityName}</p>
                        <p>{favorite.currentCityData.WeatherText}</p>
                     </div>
                  </NavLink>
               );
            })}
         </div>
      </div>
   );
}

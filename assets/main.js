var userFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-input');
var cityButtonsEl = document.querySelector('#major-cities-buttons');
var fiveDayContainerEl = document.querySelector('#five-day-forecast-container');
var currentCitySearch = document.querySelector('#Current-City-search');
var masterResultsContainerEl = document.querySelector("#master-results-container");
var currentCityDayContainerEl = document.querySelector("#current-city-container");
var fiveDayPromptEl = document.querySelector("#five-day-forecast");
var recentCitiesEl = document.querySelector("#recent-cities-buttons")
var lon = "";
var lat = "";


// form submit event handler for search results
var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var userInputEl = cityInputEl.value.trim();
  
    if (isNaN(userInputEl)) {
        var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+ userInputEl +'&limit=1&appid=349ff99c6078919fabcd80ffc046fad1';
        fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                lon = data[0].lon;
                lat = data[0].lat;
                console.log(lat);
                console.log(lon);
                getCityData(lon, lat);

            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect OpenWeather.com connection');
        });
    //   getUserRepos(lon, lat);
  
      fiveDayContainerEl.textContent = '';
      cityInputEl.value = '';
    } else {
        // converts Zip Code to lon at lats
        var apiUrl = 'http://api.openweathermap.org/geo/1.0/zip?zip='+ userInputEl +'&appid=349ff99c6078919fabcd80ffc046fad1';
        fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                lon = data.lon;
                lat = data.lat;
                console.log(lat);
                console.log(lon);
                getCityData(lon, lat);
            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect OpenWeather.com connection');
        });
      
  
      fiveDayContainerEl.textContent = '';
      cityInputEl.value = '';;
    }
  };

// gets city data from converted lon at lat
var getCityData = function (lon, lat) {
  
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + lon +'&units=imperial&appid=349ff99c6078919fabcd80ffc046fad1';
  
    fetch(apiUrl)
      .then(function (response) {
        if (!response.ok){
          throw response.json();
        } 
          return response.json();
      })
      .then(function (locInfo){
        currentCitySearch.textContent = locInfo.city.name
        fiveDayPromptEl.textContent = "5 Day Forecast: "
        console.log(locInfo);

        if(!locInfo.list.length){
          console.log("No results found!");
          fiveDayContainerEl.innerHTML = "No results found"
        } else{
          displayCurrentDayInfo(locInfo.list[0])
          for(var i = 0; i < locInfo.list.length; i+=8){
            displayFiveDayInfo(locInfo.list[i])
            console.log(locInfo.list)
          }
        }
        
        createCityButton(locInfo.city)
      })
      .catch(function (error) {
        alert('Unable to connect OpenWeather.com');
      });
  };

function displayFiveDayInfo(list){
  console.log(list)

  var dayCard = document.createElement("div");
  dayCard.classList.add("list-group", "flex-row");
  
  var dayBody = document.createElement("div");
  dayBody.classList.add("card", "flex-body" ,);
  dayBody.style.cssText ="width: 18rem;";
  dayCard.append(dayBody);

  var dayEl = document.createElement("h3");
  var dt = list.dt
  console.log(dt)
  var date = new Date (dt * 1000);
  var date_str = [date.getMonth()+1, date.getDate(), date.getFullYear()].join("/");
  dayEl.textContent = date_str 

  var imgIconEL = document.createElement("img");
  var imgSrc = "https://openweathermap.org/img/wn/" + list.weather[0].icon+"@2x.png";
  imgIconEL.src = imgSrc

  var tempContentEL = document.createElement("p");
  var temp = list.main.temp;
  tempContentEL.innerHTML = "<strong>Temp:</strong> " + Math.round(temp) + "F";

  var windContainerEL = document.createElement("p");
  windContainerEL.innerHTML = "<strong>Wind:</strong> " + list.wind.speed + " MPH";

  var humidityContainerEl = document.createElement("p");
  humidityContainerEl.innerHTML = "<strong>Humidity:</strong> " + list.main.humidity + "%";

  dayBody.append(dayEl,imgIconEL,tempContentEL,windContainerEL,humidityContainerEl);
  fiveDayContainerEl.append(dayCard)
}
function displayCurrentDayInfo(data){
  // gets current weather image id and updates image 
  
  var currentWeatherIcon = document.getElementById("today-weather-icon");
  var weatherIconSrc = "https://openweathermap.org/img/wn/" + data.weather[0].icon+"@2x.png";
  currentWeatherIcon.src = weatherIconSrc

  var currentDateEl = document.createElement("h3");
  var dt = data.dt
  var date = new Date (dt * 1000);
  var date_str = [date.getMonth()+1, date.getDate(), date.getFullYear()].join("/");
  currentDateEl.textContent = date_str 

  var currentTempEl = document.createElement("p");
  var currentTemp = data.main.temp;
  currentTempEl.innerHTML = "<strong>Temp:</strong> " + Math.round(currentTemp) + "F";

  var currentWindEl = document.createElement("p");
  currentWindEl.innerHTML = "<strong>Wind:</strong> " + data.wind.speed + " MPH";

  var currentHumidityEl = document.createElement("p");
  currentHumidityEl.innerHTML = "<strong>Humidity:</strong> " + data.main.humidity + "%";

  currentCityDayContainerEl.classList.add("card")
  currentCityDayContainerEl.append(currentDateEl, currentTempEl, currentWindEl)

}

function createCityButton (data){
    var currentCity = JSON.parse(localStorage.getItem("city")) || [];
    var cityInfo = {
         lat:data.coord.lat, lon:data.coord.lon}
    
    var cityName = data.name + "," + data.country
    currentCity.push(cityInfo);
    localStorage.setItem(cityName, JSON.stringify(currentCity));
    
    var newBtn = document.createElement("button");
    newBtn.classList.add("btn");
    newBtn.setAttribute('id', cityName);
    newBtn.innerHTML = cityName;
    recentCitiesEl.append(newBtn)
}

// function loadLocalStorage(data){
//   var cityPushed = this.button
//   console.log(cityPushed)
//   var cityInfo = JSON.parse(localStorage.getItem(cityPushed));
  
 

// }
//recentCitiesEl.addEventListener('click', loadLocalStorage);
userFormEl.addEventListener('submit', formSubmitHandler);
var userFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-input');
var cityButtonsEl = document.querySelector('#major-cities-buttons');
var fiveDayContainerEl = document.querySelector('#five-day-forecast-container');
var currentCitySearch = document.querySelector('#Current-City-search');
var masterResultsContainerEl = document.querySelector("#master-results-container");
var currentCityDayContainerEl = document.querySelector("#current-city-container");
var fiveDayPromptEl = document.querySelector("#five-day-forecast");
var recentCitiesEl = document.querySelector("#recent-cities-buttons");
var currentCityDataEl = document.querySelector("#current-city-data");
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
        .catch(function (error) { //if an error occurs this prompt will show up for the user 
            alert('Unable to connect OpenWeather.com connection');
        });
      
  
      fiveDayContainerEl.textContent = '';
      cityInputEl.value = '';
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
  // gets 5 day forecast and renders them into their own cards.
  console.log(list)

  //creates container for all the cards 
  var dayCard = document.createElement("div");
  dayCard.classList.add("list-group", "flex-row");
  
  var dayBody = document.createElement("div");
  dayBody.classList.add("card", "flex-body" ,);
  dayBody.style.cssText ="width: 18rem;";
  dayCard.append(dayBody);

  // takes time element in YYYY-MM-DD format and changes it to MM/DD/YY
  var dayEl = document.createElement("h3");
  var dt = list.dt
  console.log(dt)
  var date = new Date (dt * 1000);
  var date_str = [date.getMonth()+1, date.getDate(), date.getFullYear()].join("/");
  dayEl.textContent = date_str 

  // gets and renders image for weather in each element
  var imgIconEL = document.createElement("img");
  var imgSrc = "https://openweathermap.org/img/wn/" + list.weather[0].icon+"@2x.png";
  imgIconEL.src = imgSrc

  // renders temp for each day
  var tempContentEL = document.createElement("p");
  var temp = list.main.temp;
  tempContentEL.innerHTML = "<strong>Temp:</strong> " + Math.round(temp) + "F";

  // gets wind for each day
  var windContainerEL = document.createElement("p");
  windContainerEL.innerHTML = "<strong>Wind:</strong> " + list.wind.speed + " MPH";

  var humidityContainerEl = document.createElement("p");
  humidityContainerEl.innerHTML = "<strong>Humidity:</strong> " + list.main.humidity + "%";

  dayBody.append(dayEl,imgIconEL,tempContentEL,windContainerEL,humidityContainerEl);
  fiveDayContainerEl.append(dayCard)
}
function displayCurrentDayInfo(data){
  //clears card data so duplicate data doesn't append
  clearData();
  // gets current weather image id and updates image 
  var currentWeatherIcon = document.getElementById("today-weather-icon");
  var weatherIconSrc = "https://openweathermap.org/img/wn/" + data.weather[0].icon+"@2x.png";
  currentWeatherIcon.src = weatherIconSrc

  // current date formate is YYYY-MM-DD this converts it to MM/DD/YYYY then renders it on the page 
  var currentDateEl = document.createElement("h3");
  var dt = data.dt
  var date = new Date (dt * 1000);
  var date_str = [date.getMonth()+1, date.getDate(), date.getFullYear()].join("/");
  currentDateEl.textContent = date_str 

  // creates Temperature element then gets temp from API and then inserts it to page
  var currentTempEl = document.createElement("p");
  var currentTemp = data.main.temp;
  currentTempEl.innerHTML = "<strong>Temp:</strong> " + Math.round(currentTemp) + "F";

  // creates Wind element then gets temp from API and then inserts it to page
  var currentWindEl = document.createElement("p");
  currentWindEl.innerHTML = "<strong>Wind:</strong> " + data.wind.speed + " MPH";

// creates Humidity element then gets temp from API and then inserts it to page
  var currentHumidityEl = document.createElement("p");
  currentHumidityEl.innerHTML = "<strong>Humidity:</strong> " + data.main.humidity + "%";

  // adds card element to page and then appends it with temp, wind and humidify 
  currentCityDayContainerEl.classList.add("card")
  currentCityDataEl.append(currentDateEl, currentTempEl, currentWindEl)

}

function createCityButton (data){
  // calls on local storage and gets city data
    var currentCity = JSON.parse(localStorage.getItem("city")) || [];
    var cityInfo = {
         lat:data.coord.lat, lon:data.coord.lon}
   
  // name of city we will be using as the Key 
    var cityName = data.name +"," +data.country
    currentCity.push(cityInfo);
    localStorage.setItem(cityName, JSON.stringify(currentCity));
  
  //creates new button with city name and adds id 
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
  
function clearData (){
  // clears out data in the currentCityDataEl child
  while(currentCityDataEl.firstChild){
    currentCityDataEl.removeChild(currentCityDataEl.firstChild)
  }
} 

// }
//recentCitiesEl.addEventListener('click', loadLocalStorage);
userFormEl.addEventListener('submit', formSubmitHandler);
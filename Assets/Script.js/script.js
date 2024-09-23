const API = "3724087b2b69c23d53457958d8c4de36";
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");
const iconsContainer = document.querySelector('.icon');
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednsday",
    "Thursday",
    "Friday",
    "Saturday"
];
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Display date
let month = day.toLocaleDateString("default",{month:"long"});
let date = day.getDate();
let year = day.getFullYear();
dateEl.innerHTML = month + " " + date + " " + year;

// Add event 
btnEl.addEventListener("click", (e) => {
    e.preventDefault();
    // Check empty value
    if (inputEl.value !== "") {
        const search = inputEl.value;
        inputEl.value = "";
        findLocation(search);
    } else {
        console.log("Please enter your City or Country Name");
    }
});

async function findLocation(name) {
    iconsContainer.innerHTML = '';
    dayInfoEl.innerHTML = '';
    listContentEl.innerHTML = '';
    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}&units=metric`;
        const data = await fetch(API_URL);
        const result = await data.json();
        console.log(result);

        if (result.cod !== "404") {
            const ImageContent = displayImageContent(result);
            // Display right side content
            const rightSide = rightSideContent(result);
            // Fetch and display forecast
            await displayForeCast(result.coord.lat, result.coord.lon);
            setTimeout(()=>{
                dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
            iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
            },1500);
        } else {
            const message = `<h2 class="weather_temp">${result.cod}°C</h2>
            <h3 class="cloudtxt">${result.message}</h3>`; 
            iconsContainer.insertAdjacentHTML("afterbegin", message);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayImageContent(data) {
    const iconCode = data.weather[0].icon;  // e.g. "01d", "02n"
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    return `<img src="${iconUrl}" alt="Weather Icon">
            <h2 class="weather_temp">${Math.round(data.main.temp)}°C</h2>
            <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

function rightSideContent(result) {
    return `<div class="content">
                        <p class="title">Name</p>
                        <span class="value">${result.name}</span>
                    </div>

                    <div class="content">
                        <p class="title">Temp</p>
                        <span class="value">${Math.round(result.main.temp)}°C</span>
                    </div>

                    <div class="content">
                        <p class="title">Humidity</p>
                        <span class="value">${result.main.humidity}%</span>
                    </div>

                    <div class="content">
                        <p class="title">Wind Speed</p>
                        <span class="value">${result.wind.speed} Km/h</span>
                    </div>`;
}

async function displayForeCast(lat, lon) {
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}&units=metric`;
    try {
        const data = await fetch(ForeCast_API);
        const result = await data.json();
        console.log(result);
        
        //filter the forecast
        const uniqueForeCastDays = [];
        const daysForeCast = result.list.filter((forecast) =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForeCastDays.includes(forecastDate)){
                return uniqueForeCastDays.push(forecastDate);
            }
        })
        console.log(daysForeCast);
        daysForeCast.forEach((content,index) =>{
            if(index <= 3){
                listContentEl.insertAdjacentHTML("afterbegin",forecast(content))
            }
        })
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

function forecast(frContent){
    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const splitDay = dayName.split("",3);
    const joinDay = splitDay.join("");
    return `<li>
                            <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@4x.png">
                            <span>${joinDay}</span>
                            <span  class="day_temp">${Math.round(frContent.main.temp)}°C</span>
                        </li>`;
}
//https://api.openweathermap.org/data/2.5/weather?lat=31.5497&lon=74.3436&appid=3724087b2b69c23d53457958d8c4de36
// pull from different file
const secret_api = "";
//const bypass_cors_url = "https://cors-anywhere.herokuapp.com/";
const api_uri = "https://geo.ipify.org/api/";
let current_version = "v1";

// elements to update
let current_ip = document.getElementById("current_ip");
let current_town = document.getElementById("current_town");
let current_zone = document.getElementById("current_zone");
let current_isp = document.getElementById("current_isp");

// form elements
const entered_ip = document.getElementById("ip_address");
const search_btn = document.getElementById("search-btn");
const form = document.querySelector(".form-elements");

const map = L.map("display-map", {
  center: [0, 0],
  zoom: 0,
  layers: [
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }),
  ],
});

const updateMarker = (update_marker = [-42, 42]) => {
  map.setView(update_marker, 13);
  L.marker(update_marker).addTo(map);
};

const getIPDetails = async (default_ip) => {
  let ipUrl;
  if (default_ip == undefined) {
    ipUrl = `${api_uri}${current_version}?apiKey=${secret_api}`;
  } else {
    ipUrl = `${api_uri}${current_version}?apiKey=${secret_api}&ipAddress=${default_ip}`;
  }

  try {
    const res = await fetch(ipUrl);
    const data = await res.json();

    current_ip.innerHTML = data.ip;
    current_town.innerHTML = `${data.location.city}  ${data.location.country} ${data.location.postalCode}`;
    current_zone.innerHTML = data.location.timezone;
    current_isp.innerHTML = data.isp;

    updateMarker([data.location.lat, data.location.lng]);
  } catch (err) {
    console.log(err);
  }
};

getIPDetails();

document.addEventListener("load", updateMarker());

const handleSearch = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (entered_ip.value != "" && entered_ip.value != null) {
    getIPDetails(entered_ip.value);
    return;
  }

  alert("Please enter a valid IP address");
};

form.addEventListener("submit", handleSearch);

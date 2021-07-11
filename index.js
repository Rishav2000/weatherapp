
const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, originalVal) => {
  let temperature= tempVal.replace("{%tempval%}",Math.round(originalVal.main.temp))
  temperature= temperature.replace("{%tempmin%}",Math.round(originalVal.main.temp_min));
  temperature= temperature.replace("{%tempmax%}",Math.round(originalVal.main.temp_max));
  temperature= temperature.replace("{%pressure%}",originalVal.main.pressure);
  temperature= temperature.replace("{%humidity%}",originalVal.main.humidity);
  temperature= temperature.replace("{%location%}",originalVal.name);
  temperature= temperature.replace("{%country%}",originalVal.sys.country);
  temperature= temperature.replace("{%tempstatus%}",originalVal.weather[0].main);
  temperature= temperature.replace("{%weatherstatus%}",originalVal.weather[0].description);
  return temperature;
}; 
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=6c85f6130eb7dc8bfb8a1e2b44f39049`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");



 
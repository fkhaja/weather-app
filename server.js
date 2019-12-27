const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const apiKey = '5d54f6c1f4250b3db6548f564ba696b2';


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')


app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null});
});

//use callbacks
// app.post('/', function (req, res) {
//     console.log(req.body.city);
//     let city = req.body.city;
//
//     request(url, function (err, response, body) {
//         if(err){
//             res.render('index', {weather: null, error: 'Error, please try again'});
//         } else {
//             let weather = JSON.parse(body);
//             console.log(weather)
//             if(weather.main == undefined){
//                 res.render('index', {weather: null, error: 'Error, please try again'});
//             } else {
//                 let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
//                 res.render('index', {weather: weatherText, error: null});
//             }
//         }
//     });
// })

//use promises
app.post('/', function (req, res) {
    console.log(req.body.city);
    let city = req.body.city;
    makeWeatherApiCall(city).then(weather => {
        res.render('index', weather);
    }).catch((error) => {
        res.render('index', {weather: null, error: error});
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

function makeWeatherApiCall(city) {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    return new Promise(function (resolve, reject) {
        request(url, function (err, response, body) {
            if(err) {
                return reject(err)
            }
            try {
                let weather = JSON.parse(body);
                if(weather.main == undefined){
                    reject('Error, please try again')
                } else {
                    let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                    resolve({weather: weatherText, error: null});
                }
            } catch(e) {
                reject(e)
            }
        });
    })
}




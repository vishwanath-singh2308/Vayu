const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//Initialize express
const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsDirectoryPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//handlebars engine setup and Express config
app.set('view engine','hbs')
app.set('views', viewsDirectoryPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//Root page
app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather App',
        name: 'Vishwanath'
    })
})

//Weather page
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'Please provide us a location'
        })
    }

    geocode(req.query.address, (error, {longitude,latitude,location} ={})=>{
        if(error){
            return res.send({error})
        }

        forecast(longitude,latitude,(forecastError,forecastData)=>{
            if(forecastError){
                return res.send({forecastError})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

//Error 404
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

//Start the server
app.listen(3000,()=>{
    console.log('Server is up on port 3000')
})
//importations externes
const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')


//on instancie app avec express()
const app = express()
const port = 3000


app .use(favicon(__dirname +'/favicon.ico'))//la favicon
    .use(morgan('dev')) // pour les informations de log dans la console
    .use(bodyParser.json())//parser les requete entrante/sortanante en js

sequelize.initDb()

//mise en place les points de terminaisons.
require('./src/routes/findAllPokemons')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemons')(app)
require('./src/routes/deletePokemons')(app)


app.listen(port, ()=> console.log(`Notre application va démarer sur: http://localhost:${port}`))


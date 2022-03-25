//importations externes
const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')


//on instancie app avec express()
const app = express()
const port = process.env.Port || 3000


app .use(favicon(__dirname +'/favicon.ico'))//la favicon
    .use(bodyParser.json())//parser les requete entrante/sortanante en js

sequelize.initDb()
//endpoint racine
app.get('/', (req, res)=>{
    res.json('Hello, Pokedex')
})

//mise en place les points de terminaisons.
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPK')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemons')(app)
require('./src/routes/deletePokemons')(app)
require('./src/routes/login')(app)

// on ajoute la gestion des erreurs 
app.use(({res})=>{
    const message = 'Impossible de trouver la ressource demandée! Vous pouvez essayer une autre URL.'
    res.status(404).json({message})
})

app.listen(port, ()=> console.log(`Notre application va démarer sur: http://localhost:${port}`))

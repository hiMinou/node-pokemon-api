const { Pokemon } = require('../db/sequelize')
 const {Op }= require('sequelize') 

module.exports = (app) => {
  app.get('/api/pokemons', (req, res) => {
    if(req.query.name){
      const name = req.query.name
      const limit = parseInt(req.query.limit) || 5
      if(name.length <2){
        const message = `Votre recherche doit contenir au moins 2 caractères.`
       return res.status(400).json({message})
      }
      return Pokemon.findAndCountAll({
        where: {
          name: {[Op.like]:`%${name}%`}// name==name avec ()
        },
        order: ['name'], //['name', 'ASC']
        limit: limit

      }) 
      .then(({count, rows})=>{
        const message = `Il y a ${count} pokémon(s) correspondant au terme de la recherche ${name}`
        res.json({message, data: rows})
      })
    }else{
      Pokemon.findAll()
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      
      })
      .catch(error => {
        const message = `La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error})
      })
    }
    
  })
}
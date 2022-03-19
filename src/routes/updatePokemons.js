const { ValidationError } = require('sequelize')
const { Pokemon } = require('../db/sequelize')
  
module.exports = (app) => {
  app.put('/api/pokemons/:id', (req, res) => {
    const id = req.params.id
    Pokemon.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      return Pokemon.findByPk(id).then(pokemon => {
        if(pokemon === null){
          const message = `le pokémon demandé n'existe pas. Réesseyez avec un autre identifiant`
          return res.status(404).json({message})
        }
        const message = `Le pokémon ${pokemon.name} a bien été modifié.`
        res.json({message, data: pokemon })
      })
    })
    .catch(error => {
      if(error instanceof ValidationError){
          return res.status(400).json({message: error.message, data: error})
      }
      if(error instanceof UniqueConstraintError){
          return res.status(400).json({message: error.message, data: error})
      }
      const message = `La liste des pokkémons n'a pas pu être récupérée. Réessayez dans quelques instants.`
      res.status(500).json({message, data: error})
    })
  })
}
const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pokemon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:{ msg:'Ce nom de pokémon est déjà pris. Vous pouvez changer de nom.'
      },
      validate:{
        notEmpty:{msg:"Le nom du pokemon ne peut pas être vide."},
        notNull:{msg:'Le nom du pokémon est une propiété requise.'},
        max:{
          args: [25],
          msg: 'Le nom du pokemon est limité à 29 caractère.'
        }
        
      }
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        isInt:{ msg: 'Utiliser uniquement des nombres entiers pour les points de vie'},
        notNull:{ msg: 'Les point de vie sont une propiété requise.'},
        min:{
          args: [0],
          msg: 'Le minimun de hp est à 0.'
        },
        max:{
          args: [999],
          msg: 'Le maximun de hp est à 999.'
        }
      }
    },
    cp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        isInt:{ msg: 'Utiliser uniquement des nombres entiers pour les points de vie'},
        notNull:{ msg: 'Les point de vie sont une propiété requise.'},
        min:{
          args: [0],
          msg: 'Le minimun de cp est à 0.'
        },
        max:{
          args: [99],
          msg: 'Le maximun de cp est à 99.'
        }
      }
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isUrl:{ msg: 'La propiété picture du pokemon doit être définie sous la forme d\'une Url.'},
        notNull:{ msg: 'Les point de vie sont une propiété requise.'}
      }
    },
    types: {
      type: DataTypes.STRING,
      allowNull: false,
      get(){
        return this.getDataValue('types').split(',')
      },
      set(types){
        this.setDataValue('types', types.join())
      },
      validate:{
        isTypeValide(value){
          if(!value){
            throw new Error('Un pokemon doit avoir au moins un type.')
          }
          if(value.split(',').length > 3){
            throw new Error('Un pokemon ne peut pas avoir plus de trois types.')
          }
          value.split(',').forEach(type => {
            if(!validTypes.includes(type)){
              throw new Error(`Le type d'un pokemon doit appartenir à la liste suivante: ${validTypes}`)
            }
          });
        }
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false
  })
}
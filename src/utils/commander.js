const { Command } = require('commander')

const program  = new Command()

program.option('--mode <mode>', 'manejo de entornos').parse()

module.exports = { program }
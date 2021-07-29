const express = require('express')
const Joi = require('joi')
const helmet = require('helmet')
const morgan = require('morgan')
const logger = require('./middleware/logger')
const courses = require('./routes/courses')
const homepage = require('./routes/homepage')
const config = require('config')
const debug = require('debug')('app:startup')
const app = express()


// Configuration
console.log(`Application name: ${config.get('name')}`)
console.log(`Mail server: ${config.get('mail.host')}`)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet())
app.use(logger)
app.use('/api/courses', courses)
app.use('/', homepage)

app.set('view engine', 'pug')
app.set('views', './views')

if (app.get('env') === 'development') {
    app.use(morgan('common'))
    debug('Morgan enable...')
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

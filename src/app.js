const express = require('express');
const handlebars= require('express-handlebars');
const path = require('path');
const { connectDB, configObject } = require("./config");
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { initializePassport} = require('./config/passport.config');
const appRouter = require('./routes/index')
/*const { addLogger } = require('./utils/logger')
const { handleError } = require('./middlewares/error/handleError');*/

console.log("estoy andando")

const app = express();
const port = configObject.PORT

connectDB();

const hbs = handlebars.create({
    extname: '.hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts'), runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
        }
})

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

initializePassport();
app.use(passport.initialize())

//app.use(addLogger)
app.use(appRouter)
//app.use(handleError)

const serverhttp = app.listen(port, err=>{
    if (err){
        console.log(err)
    }
    console.log(`esuchando en el puerto ${port}`)
})

/*const io = new server(serverhttp);
console.log(`Socket.io server listening ${port}`);*/
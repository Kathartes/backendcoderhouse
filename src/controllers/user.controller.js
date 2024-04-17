const { userService , cartService} = require('../repositories/services.js')
const { createHash, isValidPassword} = require('../utils/hashPassword')
const { createToken } = require('../utils/jwt')
const { logger } = require('../utils/logger')
//const { sendMail } = require('../utils/sendMail')


class UserController{
    constructor(){
        this.userService = userService
        this.cartService = cartService
    }
    getUser = async(req, res)=>{
        try{
        const result = await this.userService.getUser();
        res.json({result});
        }
        catch(error){
            res.status(500).send('Error al obtener los usuarios')
        }
    }
    getCurrentUser = async(req, res)=>{
        try{
        const user = await this.userService.getUserByFilter(req.user);
        res.send(user);
        }
        catch(error){
            res.status(500).send('Error al obtener usuario')
        }
    }
    updateUser = async(req, res)=>{
        try{
        const userId = req.params.uid;
        const user  = await this.userService.getUserByFilter(userId);
       

        if(user.role === 'user' && user.status === true){
          await this.userService.updateUser(userId, { role: 'premium'});
        }
        else if(user.role === 'premium') {
          await this.userService.updateUser(userId, { role: 'user'})
        }
        const userUpdated = await this.userService.getUserByFilter(userId)
        const token = createToken({ id: userUpdated._id, first_name: userUpdated.first_name, last_name: userUpdated.last_name, email: userUpdated.email, cart: userUpdated.cart, role: userUpdated.role, profile: userUpdated.profile, status: userUpdated.status })

        if (result.error) {
            return res.send(result.error);
          }
          res.cookie('token', token, {
            maxAge: 3600000,
            httpOnly: true,
        
          }).json({
            status: 'success',
            message: 'role change',
          })
        
        }
        catch(error){
            res.status(500).send('Error al modificar usuario')
        }
    }
    createUser = async(req,res)=>{
        try{
        const cart = await this.cartService.createCart();  

        const { firstName, lastName, email, password, age, role } = req.body

        
        const existingUser = await this.userService.getUserByFilter({ email });
        
        if (existingUser) {
            console.error('Ese Email ya esta en uso.');
            return { error: 'Ese Email ya está en uso.' };
          }
          console.log( firstName, lastName, email, cart, password, age, role, documents )
          console.log(cart._id)
          const cartId = await this.cartService.getCart({_id : cart._id})
          console.log (cartId._id + "este es el id del cart")
        const user = {
            first_name: firstName,
            last_name: lastName,
            email,
            password: await createHash(password),
            age,
            cart: cartId._id,
            role,
            documents: []
        } 
        console.log(user)
        const result = await this.userService.createUser(user);
        console.log(result)

        const token = createToken({id:result._id})

        if (result.error) {
            return res.send(result.error);
          }
          res.cookie('token', token, {
            maxAge: 3600000,
            httpOnly: true,
        
          }).json({
            status: 'success',
            message: 'register',
            redirectUrl: '/login',
          })

   
        }
        catch(error){
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    }
    createLogin = async (req, res) => {
        const { email, password } = req.body;
        const user = await this.userService.getUserByFilter({ email });
    
      
        if (!user) {
          logger.error('El usuario no existe')
          return res.status(400).send('El Usuario no existe');
        }
    
      
        if (!(await isValidPassword(password, user.password))) {
          logger.error('Password incorrecta')
          return res.status(401).send('Contraseña inválida');
        }
    
        const token = createToken({ id: user._id, first_name: user.first_name, last_name: user.last_name, email, cart: user.cart, role: user.role })
        res.cookie('token', token, {
          maxAge: 3600000,
          httpOnly: true,
         
        }).json({
          status: 'success',
          message: 'logged in',
          redirectUrl: '/products',
        })
      }

    deleteUser = async(req,res)=>{
        try{
        const userId = req.params.uid;
        const deletedUser = await this.userService.deleteUser(userId);
        res.json({deletedUser})
        }
        catch(error){
            res.status(500).send('Error al eliminar usuario')
        }
    }
    
}
module.exports = UserController
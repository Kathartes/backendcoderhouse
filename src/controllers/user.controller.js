const { userService , cartService} = require('../repositories/services.js')
const { createHash, isValidPassword} = require('../utils/hashPassword')
const { createToken } = require('../utils/jwt')
const { logger } = require('../utils/logger')
const { sendMail } = require('../utils/sendMail')


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
    updateUserAdmin = async(req, res)=> {
      
      const userId = req.params.uid;
      const  { role }  = req.body;
      let newRole
      
      if(role === "premium"){
        newRole = "user"
        await this.userService.updateUser(userId, { role: newRole })
      }else if(role === "user") {
        newRole = "premium"
        await this.userService.updateUser(userId, { role: newRole })
      }
      

      
      res.status(200).json({ message: "Rol de usuario actualizado correctamente" });
    }

    updateUser = async(req, res)=>{
        try{
        const userId = req.params.uid;
        const user  = await this.userService.getUserByFilter({_id: userId});
       console.log(`updatecontroller ${userId}, ${user.role}`)
       console.log(user)

        if(user.role === 'user' && user.status === true){
          await this.userService.updateUser(userId, { role: 'premium'});
        }
        else if(user.role === 'premium') {
          await this.userService.updateUser(userId, { role: 'user'})
        }
        const userUpdated = await this.userService.getUserByFilter({_id: userId})
        console.log(userUpdated.role)
        const token = createToken({ id: userUpdated._id, first_name: userUpdated.first_name, last_name: userUpdated.last_name, email: userUpdated.email, cart: userUpdated.cart, role: userUpdated.role, profile: userUpdated.profile, status: userUpdated.status })

 
          res.cookie('token', token, {
            maxAge: 3600000,
            httpOnly: true,
        
          }).json({
            status: 'success',
            message: 'role change',
            redirectUrl: '/role'
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
          console.log( firstName, lastName, email, cart, password, age, role)
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
        

        const token = createToken({id:result._id})
        
        
        const subject = "Creacion de cuenta"
        const html = `<div><h1> ${firstName} su cuenta en ecommerce fue creada con exito</h1></div>`

        sendMail(email, subject, html)

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
    logout = async (req, res) => {
      try {
        console.log("entre al logut")
        const userId = req.user._id
        this.userService.updateUser(userId, { last_connection: new Date()});
        res.clearCookie('token')
        res.status(200).json({ status: 'success', message: 'sesion cerrada'})
      } catch (error) {
        res.status(500).send('Internal Server Error');
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
    
        const token = createToken({ id: user._id, first_name: user.first_name, last_name: user.last_name, email, cart: user.cart, role: user.role, status: user.status })
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
        console.log(`estoy en el controller ${userId}`)
        const user = await this.userService.getUserByFilter({_id: userId});
        console.log(user.cart)

        if(user.role === "admin"){
          return res.status(400).send('No se puede eliminar al administrador');
        }

        await this.cartService.deleteCart(user.cart)
        await this.userService.deleteUser({_id: userId});
        res.status(200).send({status: 'success'})
        }
        catch(error){
            res.status(500).send('Error al eliminar usuario')
        }
    }
    deleteTime = async(req,res)=>{
      try{
      
        const date = new Date();
        const limitDate = new Date(date - 2 * 24 * 60 * 60 * 1000);
        const minActivityDays = 2;
        const filter = {
          last_connection: { $lt: limitDate },
          role: { $ne: 'admin' }
        };

        const inactives = await this.userService.getUser(filter);
        console.log(inactives)

        if (inactives.length > 0) {
          await Promise.all(inactives.map(async (inactiveUser) => {
            const lastConnection = new Date(inactiveUser.last_connection);
            const dfferenceDays = Math.floor((date - lastConnection) / (1000 * 60 * 60 * 24 ));
  
            if (dfferenceDays >= minActivityDays) {
              const to = inactiveUser.email;
              const subject = 'Cuenta Eliminada';
              const html = `<div><h1>Se elimino su cuenta por inactividad</h1></div>`;
              await sendMail(to, subject, html);
            }
          }));
          await this.cartService.deleteCart(inactives.cart)
          await this.userService.deleteUserTime(filter)
        }

      
        res.status(200).send({status: 'success'})
      }
      catch(error){
          res.status(500).send('Error al eliminar los usuarios')
      }
  }
    uploadFiles = async (req, res) => {
      try{
      const userId = req.params.uid;
      const { identificacion, domicilio, cuenta, profile } = req.files;
      const user = await this.userService.getUserByFilter({_id: userId});
      
      console.log(`uploadcontroller ${identificacion}, ${domicilio}, ${cuenta}, ${profile}`)

      if (user.role === 'user' && (identificacion && domicilio && cuenta) && !profile && user.status === false) {
        
        const updatedDocuments = [
          { name: 'Identificación', reference: `/files/documents/${identificacion[0].filename}` },
          { name: 'Comprobante de domicilio', reference: `/files/documents/${domicilio[0].filename}` },
          { name: 'Comprobante de estado de cuenta', reference: `/files/documents/${cuenta[0].filename}` }
        ];
  
        
        await this.userService.updateUser(userId, { documents: updatedDocuments, status: true });
      }
      else if (profile && (!identificacion || !domicilio || !cuenta)) {
        console.log('aqui en profile')
        const updatedProfile = `/files/profiles/${profile[0].filename}`;
  
       
        await this.userService.updateUser(userId, { profile: updatedProfile });
      }
      const userUpdated = await this.userService.getUserByFilter({_id: userId});
        const token = createToken({ id: userUpdated._id, first_name: userUpdated.first_name, last_name: userUpdated.last_name, email: userUpdated.email, cart: userUpdated.cart, role: userUpdated.role, profile: userUpdated.profile, status: userUpdated.status })
        res.cookie('token', token, {
          maxAge: 3600000,
          httpOnly: true,
          
        }).json({
          status: 'success',
          message: 'Role Updated',
          redirectUrl: '/role',
        })
        
        logger.info(user)
      } catch (error) {
        logger.error(error.message);
        res.status(404).send('User Not Found');
      }
    }
    userRecovery = async (req, res) => {
      try {
        const { email } = req.body
        const user = await this.userService.getUserByFilter({ email });
  
        if (!user) {
          return { error: 'Usuario no encontrado' };
        }
  
        const token = createToken({ email: user.email, password: user.password })
  
        const to = email
        const subject = 'Recuperacion de contraseña'
        const html = `
        <p>Haz clic en el siguiente enlace para recuperar su contraseña:</p>
        <p><a href="http://localhost:8080/passrecovery/${token}">Restablecer contraseña</a></p>
      `
        await sendMail(to, subject, html);
        return res.status(200).send('Mail Enviado.');
  
      } catch (error) {
        res.status(400).send('Invalid Email')
      }
    }
  
    resetPass = async (req, res) => {
      try {
        const { email, newPassword, repPassword } = req.body;
        console.log(`estoy en el controller reset ${email} ${newPassword} ${repPassword}`)
        if (newPassword !== repPassword) {
          return res.status(400).send('Las contraseñas no coinciden.');
        }
  
        const user = await this.userService.getUserByFilter({  email });
        console.log(user)
        if (!user) {
          return res.status(400).send('Usuario no encontrado.');
        }
  
        const hashedNewPassword = await createHash(newPassword);
  
        await this.userService.updateUser(user._id, { password: hashedNewPassword });
  
        res.send('Contraseña restablecida correctamente.');
      } catch (error) {
        res.status(500).send('Error interno del servidor');
      }
    }
    
}
module.exports = UserController
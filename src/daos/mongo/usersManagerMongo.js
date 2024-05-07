const { userModel} = require('./models/users.model');

class UserDaoMongo {
    constructor(){
        this.model = userModel;
    }
    async get(){
        return await this.model.find();
    }
    async getBy(filter){
        return await this.model.findOne(filter);
    }
    async create(user){
        return await this.model.create(user);
    }
    async update(uId, updatedUser){
        return await this.model.findOneAndUpdate({_id: uId}, {$set: updatedUser}, {new : true})
    }
    async delete(uId){
        return await this.model.findByIdAndDelete(uId)
    }
    async deleteTime(filter){
        return await this.model.deleteMany(filter)
    }
}

module.exports = UserDaoMongo;
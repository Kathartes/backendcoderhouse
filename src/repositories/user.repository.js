class UserRepository {
    constructor(dao) {
        this.dao = dao
    }
    getUser = async() => await this.dao.get()

    getUserByFilter = async(filter) => await this.dao.getBy(filter)

    createUser = async(user)=> await this.dao.create(user)
    
    updateUser = async(uId, updateUser)=> await this.dao.update(uId, updateUser)

    deleteUser = async(uId)=> await this.dao.delete(uId)

    deleteUserTime = async(filter) => await this.dao.deleteTime(filter)
}

module.exports = { UserRepository}
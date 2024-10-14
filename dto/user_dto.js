class User_DTO{
    constructor(user){
      
        this._id = user._id;
        this.email = user.email;
        this.user_role = user.user_role;
        this.address = user.address;
        this.first_name= user.first_name;
        this.last_name= user.last_name;
        this.dob= user.dob;
        this.gender= user.gender;
    }
}

module.exports = User_DTO;
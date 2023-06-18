const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userShcema = mongoose.Schema({
name:{
    type: String,
    required: true
},
email:{
    type: String,
    required: true
},
password:{
    type: String,
    required: true
},
isAdmin:{
    type:Boolean,
    default: false
}
},{
    timestamps: true
});

//hashing password
userShcema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }    
    
    const hashedPwd = await bcrypt.hash(this.password, 10);
    this.password = hashedPwd;
    next();    
    })

module.exports = mongoose.model('User', userShcema);
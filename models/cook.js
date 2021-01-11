const mongoose  = require("mongoose")

let userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    email: {
        type: String,
        validate: {
          validator: async function(email) {
            const user = await this.constructor.findOne({ email });
            if(user) {
              if(this.id === user.id) {
                return true;
              }
              return false;
            }
            return true;
          },
          message: props => 'The specified email address is already in use.'
        },
        required: [true, 'User email required']
      },

    about:String,
    address:[
        {
        tel:String,
        dist:String,
    }
],
    token:String,
    password:String
})

let cookSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    bio:String,
    budget:Number,
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

})
userSchema.set('validateBeforeSave', false);

userSchema.path('email').validate(function(value, done) {
    this.model('User').count({ email: value }, function(err, count) {
        if (err) {
            // return done(err);
            console.warn(err)
        } 
        // If `count` is greater than zero, "invalidate"
        done(!count);
    });
}, 'Email already exists');
var uschema=mongoose.model('users',userSchema)
var cschema = mongoose.model('cooks',cookSchema)

module.exports = {User:uschema,Cook:cschema}




import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the attributes of a user 
const userSchema = mongoose.Schema(
    {
        lastname: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate:{
                validator: (value)=>{
                    return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
                }
            }
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum : ['user', 'employee', 'admin'],
            default: 'user'
        },
        puzzles: {
            type: Number,
            default: 0
        },
        imageLink: {
            type: String,
            required: false,
        }
    }
);

// Only save hashed passwords
userSchema.pre('save', function(next) {

    // Only save new passwords 
    if (this.isNew || this.isModified('password')) {

        // Can't modify this.password directly
        const user = this;

        // Hash the new password
        bcrypt.hash(this.password, 5,
            function(err, hashedPassword) {
            if (err) {
                next(err);
            }
            else {
                user.password = hashedPassword;
                next();
            }
            });
    } else {
        next();
    }
});

// Compare hashed password values
userSchema.methods.isCorrectPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// Create user token
// TODO replace jwt key
userSchema.methods.jwtGenerateToken = function() {
    return jwt.sign({id: this.id}, 'ABCDEFG', {
        expiresIn: "8h"
    });
}

// Persist user schema to mongodb
export const User = mongoose.model("User", userSchema);
export default User;
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImages: {
        type: [String], // Array of cloudinary URLs
        default: []
      }
    }, { timestamps: true });

    UserSchema.pre('save', async function(next) {
        if (!this.isModified('password')) return next();
        
        try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
          next();
        } catch (error) {
          next(error);
        }
      });
      
      // Method to compare password
      UserSchema.methods.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
      };
      
      const User = mongoose.model('User', UserSchema);
      
      module.exports = User;
      

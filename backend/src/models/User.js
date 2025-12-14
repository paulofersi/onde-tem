const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true, // Permite múltiplos nulls
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      // Password só é obrigatório se não tiver firebaseUid
      return !this.firebaseUid;
    },
    minlength: 6,
  },
  pushToken: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  // Só hash password se não tiver firebaseUid e password foi modificado
  if (this.firebaseUid || !this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);


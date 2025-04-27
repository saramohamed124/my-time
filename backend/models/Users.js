const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => {
                // Allow Arabic or Latin characters with at least 3 characters
                return /^[\u0600-\u06FF\s]{3,}$|^[a-zA-Z\s]{3,}$/.test(v);
            },
            message: props => `${props.value} is not a valid first name. It should be at least 3 characters long and contain only letters and spaces.`,
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => {
                // Allow Arabic or Latin characters with at least 3 characters
                return /^[\u0600-\u06FF\s]{3,}$|^[a-zA-Z\s]{3,}$/.test(v);
            },
            message: props => `${props.value} is not a valid last name. It should be at least 3 characters long and contain only letters and spaces.`,
        }
    },
    specialty_id: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            // Match valid Gmail addresses with optional domains (.com, .co, .net)
            validator: (v) => {
                return /^[a-zA-Z0-9._%+-]+@gmail\.(com|co|net)$/.test(v);
            },
            message: props => `${props.value} is not a valid email address. Only Gmail accounts are allowed.`,
        }
    },
    password: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: (v) => {
                if (!v) return true;
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]){7,24}/.test(v);
            },
            message: props => `${props.value} is not a valid password. It should contain at least one lowercase letter, one uppercase letter, one number, one special character, and be between 7 and 24 characters long.`,
        }
    },
        role: {
        type: String,
        default: "Student"
    }
});

module.exports = mongoose.model("Users", UserSchema);

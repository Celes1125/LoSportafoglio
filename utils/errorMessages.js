module.exports = {
    general : {
        required: "Field {PATH} is mandatory",
        minlength: "Field {PATH} must be at least 4 characters long"
        
    }, 

    users: {
        wrongPassword: "Your {PATH} must be between 6-12 characters long, and contain at least one number, one lowercase letter, and one uppercase letter.",
        wrongEmail: "{PATH} must be a valid email address.",
        noUser: "No users match the provided data.",
        wrongName: "The name must be at least 4 characters long and can only contain letters, numbers, and spaces."
    }
    
}
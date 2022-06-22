module.exports = class UserDto{
    id;
    email;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
    }
}
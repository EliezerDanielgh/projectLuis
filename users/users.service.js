const db = require('../utils/db');
const { ObjectId } = require('bson');
const bcrypt = require("bcryptjs");
const config = require("config.json");
const Development = true;
const jwt = require("jsonwebtoken");
const randT = require("rand-token");
const clientService = require("../clients/clients.service");
const categoryService = require("../categories/categories.service");
const { asyncForEach } = require("../utils/generalFunctions")

const {
    User,
    Role
} = db;

let refreshTokens = {};


// TODO: Events for Model Role

const getAllRoles = async () => {
    return await Role.find({});
}

const getRoleById = async (id) => {
    const currentRole = await Role.findOne({ _id: ObjectId(id) });
    if (!currentRole) {
        throw 'Role not found';
    }
    return currentRole;
}

const addRole = async (role) => {
    let newRole;
    if (!('description' in role)) {
        throw 'Field description not defined';
    }
    try {
        newRole = new Role(role);
        await Role.create(newRole);
    } catch (error) {
        throw error;
    }
    return newRole;
}

const updateRole = async (id, role) => {
    let currentRole = await Role.findOne({ _id: ObjectId(id) });
    if (!role) {
        throw 'Role not found';
    }
    try {
        role.updatedDate = Date.now();
        Object.assign(currentRole, role);
        await Role.updateOne({ _id: ObjectId(id) }, currentRole);
    } catch (error) {
        throw error;
    }
    return currentRole
}

const deleteRole = async (id) => {
    const currentRole = await Role.findOne({ _id: ObjectId(id) });
    if (!currentRole) {
        throw 'Role not found';
    }
    const usersOnRole = await User.find({ role: id });
    if (usersOnRole.length > 0) {
        throw 'Cannot be deleted as there are users with the role';
    }
    const response = await Role.deleteOne({ _id: ObjectId(id) });
    return response;
}

const assingRoleAproven = async (id, permits) => {
    console.log("entro")
    const role = await getRoleById(id);
    let errors = [];
    if (!role) {
        throw 'Role not found';
    }
    if (permits.length <= 0) {
        throw 'The permission array cannot be empty';
    }

    if (!role.canSuper) {
        if (!role.canApprove) {
            throw 'User does not have permission to approve';
        }
    }

    await asyncForEach(permits, async (permit) => {
        try {
            if (!('client' in permit) || permit.client === '') {
                errors.push({ ...permit, error: 'the client is empty' });
            }
            let client = await clientService.getClientById(permit.client);
            if (!client) {
                errors.push({ ...permit, error: 'the client does not exist' });
            }
            if (!('categories' in permit) || permit.categories.length <= 0) {
                errors.push({ ...permit, error: 'the categories is empty' });
            }
            await asyncForEach(permit.categories, async (category) => {
                if (!('category' in category || category.category === '')) {
                    errors.push({ ...category, error: 'the category is empty' });
                }
                let currentCategory = await categoryService.getCategoryById(category.category);
                if (!currentCategory) {
                    errors.push({ ...category, error: 'The category does not exist' });
                }
            });
        } catch (error) {
            errors.push({ ...permit, error: error.message });
        }
    });

    if (errors.length > 0) {
        throw errors;
    }
    try {
        await updateRole(id, {
            permits
        });
        return role;
    } catch (err) {
        throw err;
    }

}

const getAssignmentRoleAproven = async (id) => {
    const currentRole = await Role.findOne({ '_id': ObjectId(id) }, { permits: 1 })

    if (!currentRole) {
        throw 'Role not found';
    }
    return ('permits' in currentRole) ? currentRole.permits : [];
}
// TODO: Events for Model User

const getAllUsers = async () => {
    return await User.find({}, {
        "username": 1,
        "firstName": 1,
        "lastName": 1,
        "loggedIn": 1,
        "role": 1,
        "permits": 1,
        "active": 1,
        "active": 1,
        "createdDate": 1,
        "updatedDate": 1
    }).populate("role");
}

const getUserById = async (id) => {
    const currentUser = await User.findOne({ _id: ObjectId(id) },
        {
            "username": 1,
            "firstName": 1,
            "lastName": 1,
            "loggedIn": 1,
            "role": 1,
            "permits": 1,
            "active": 1,
            "active": 1,
            "createdDate": 1,
            "updatedDate": 1
        }).populate('role');

    if (!currentUser) {
        throw 'User not found';
    }

    return currentUser;
}

const getUserByUsername = async (username) => {
    console.log(username)
    const currentUser = await User.findOne({ "username": username }, { "username": 1 });
    return currentUser;
}

const addUser = async (user) => {
    let newUser;
    //Validate the username
    if (!('username' in user) && user.username !== '') {
        throw 'Field Username not defined';
    }
    const username = user.username.trim().toLowerCase();
    if (
        await User.findOne({ username: username })
    ) {
        throw 'Username ' + username + ' is already exist';
    }
    user.username = username;

    //Validate the Role
    if (!('role' in user) && user.role !== '') {
        throw 'Field Role not defined';
    }
    if (!(await Role.findOne({ _id: ObjectId(user.role) }))) {
        throw 'the role does not exist';
    }
    user.role = ObjectId(user.role);

    //Validate the Password
    if (!('password' in user) && user.password !== '') {
        throw 'Field Password not defined';
    }
    user.hash = bcrypt.hashSync(user.password, 10);

    //Validate the FirstName
    if (!('firstName' in user) && user.firstName !== '') {
        throw 'Field FirstName not defined';
    }

    //Validate the LastName
    if (!('lastName' in user) && user.lastName !== '') {
        throw 'Field LastName not defined';
    }
    try {
        newUser = new User(user);
        await User.create(newUser)
    } catch (error) {
        throw error;
    }
    return newUser;
}

const updateUser = async (id, user) => {
    //Validate if user exists
    const currentUser = await User.findOne({ _id: ObjectId(id) });
    if (!currentUser) {
        throw 'Username does not exist';
    }

    //Validate the Username
    if ('username' in user) {
        throw 'Field username cannot be modified';
    }

    //Validate the Password
    if (('password' in user) && user.password !== '') {
        user.hash = user.password;
        delete user.password;
    }

    try {
        Object.assign(currentUser, user);
        await User.updateOne({ _id: ObjectId(id) }, currentUser);
    } catch (error) {
        throw error;
    }


    return currentUser;
}


const deleteUser = async (id) => {
    const currentUser = await User.findOne({ _id: ObjectId(id) });
    if (!currentUser) {
        throw 'User not found';
    }
    const response = await User.deleteOne({ _id: ObjectId(id) });
    return response;
}

const assingUserAproven = async (id, permits) => {
    const user = await getUserById(id);
    let errors = [];
    if (!user) {
        throw 'User not found';
    }
    if (permits.length <= 0) {
        throw 'The permission array cannot be empty';
    }

    if (!user.role.canSuper) {
        if (!user.role.canApprove) {
            throw 'User does not have permission to approve';
        }
    }

    await asyncForEach(permits, async (permit) => {
        try {
            if (!('client' in permit) || permit.client === '') {
                errors.push({ ...permit, error: 'the client is empty' });
            }
            let client = await clientService.getClientById(permit.client);
            if (!client) {
                errors.push({ ...permit, error: 'the client does not exist' });
            }
            if (!('categories' in permit) || permit.categories.length <= 0) {
                errors.push({ ...permit, error: 'the categories is empty' });
            }
            await asyncForEach(permit.categories, async (category) => {
                if (!('category' in category || category.category === '')) {
                    errors.push({ ...category, error: 'the category is empty' });
                }
                let currentCategory = await categoryService.getCategoryById(category.category);
                if (!currentCategory) {
                    errors.push({ ...category, error: 'The category does not exist' });
                }
            });
        } catch (error) {
            errors.push({ ...permit, error: error.message });
        }
    });

    if (errors.length > 0) {
        throw errors;
    }
    try {
        await updateUser(id, {
            permits
        });
        return user;
    } catch (err) {
        throw err;
    }

}

const getAssignmentUserAproven = async (id) => {

    const currentUser = await User.findOne({ '_id': ObjectId(id) }, { role: 1, permits: 1 });
    if (!currentUser) {
        throw 'User not found';
    }
    const permitsUser = ('permits' in currentUser) ? currentUser.permits : [];
    const permitsRole = (await getAssignmentRoleAproven(currentUser.role));
    let permits = { permitsRole, permitsUser };

    return permits;
}

// TODO: Validation for TOKENS

// Validate if the user is loggedIn
const isLoggedIn = async ({ username }) => {
    const user = await User.findOne({
        username
    });
    if (user !== null) {
        if (user.accesToken !== null) {
            try {
                jwt.verify(user.accesToken, config.secret);
            } catch (error) {
                if (error.name === "TokenExpiredError" && user.loggedIn) {
                    return false;
                }
            }
        }
        return user.loggedIn;
    }
    return null;
}

//process the log in
const authenticate = async ({ username, password }) => {
    const user = await User.findOne({
        username
    }).populate('role');
    if (user && bcrypt.compareSync(password, user.hash)) {
        user.loggedIn = true;
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign(
            {
                name: username,
                sub: user.id,
                rol: user.rol
            },
            config.secret,
            {
                expiresIn: Development ? 60 * 60 : 60
            }
        );

        user.accesToken = token;
        const tokenRefresh = randT.generate(16);
        refreshTokens[tokenRefresh] = username;
        await user.save();
        return {
            ...userWithoutHash,
            token,
            tokenRefresh
        };
    }
}

//Refresh the token
const gNewTokenAcces = async (usernameparam, tokenRefresh) => {
    console.log(usernameparam);
    refreshTokens[tokenRefresh] = usernameparam;
    if (
        tokenRefresh in refreshTokens &&
        refreshTokens[tokenRefresh] === usernameparam
    ) {
        var user = await User.findOne({
            username: usernameparam
        }).populate('role');
        if (user) {
            user.accesToken = jwt.sign(
                {
                    name: user.username,
                    sub: user.id,
                    rol: user.rol
                },
                config.secret,
                {
                    expiresIn: Development ? 60 * 60 : 60
                }
            );
            await user.save();
            return user.accesToken;
        } else {
            return "User Not Found";
        }
    } else {
        return "User Not Authorized";
    }
}

//Log Out
const logout = async (id, userParam) => {
    var user = await User.findOne({ _id: ObjectId(id) });
    if (!user) {
        throw "User not found";
    }
    user.loggedIn = false;
    user.accesToken = "null";
    await user.save();
}

module.exports = {
    getAllRoles,
    getRoleById,
    addRole,
    updateRole,
    deleteRole,
    assingRoleAproven,

    getAllUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUser,
    deleteUser,
    assingUserAproven,

    isLoggedIn,
    authenticate,
    gNewTokenAcces,
    logout,

    getAssignmentUserAproven,
    getAssignmentRoleAproven
}
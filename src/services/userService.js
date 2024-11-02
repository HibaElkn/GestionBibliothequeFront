// File: C:\Users\hnebm\Documents\gbiblio\src\services\userService.js
const getUsers = async () => {
    // Fetch users from API or local data
    return [
        { id: 1, codeMassar: 'ABC123', firstName: 'Thomas', lastName: 'Hardy', email: 'thomashardy@mail.com' },
        { id: 2, codeMassar: 'DEF456', firstName: 'Dominique', lastName: 'Perrier', email: 'dominiqueperrier@mail.com' },
        { id: 3, codeMassar: 'gg', firstName: 'Thomas', lastName: 'Hardy', email: 'thomashardy@mail.com' },
        { id: 4, codeMassar: 'h', firstName: 'Dominique', lastName: 'Perrier', email: 'dominiqueperrier@mail.com' },
        { id: 5, codeMassar: 'hhh', firstName: 'Thomas', lastName: 'Hardy', email: 'thomashardy@mail.com' },
        { id: 6, codeMassar: 'lll', firstName: 'Dominique', lastName: 'Perrier', email: 'dominiqueperrier@mail.com' },
        { id: 7, codeMassar: 'hhhhhh', firstName: 'Thomas', lastName: 'Hardy', email: 'thomashardy@mail.com' },
        { id: 8, codeMassar: 'rgtesdc', firstName: 'Dominique', lastName: 'Perrier', email: 'dominiqueperrier@mail.com' },
        { id: 9, codeMassar: 'mmmm', firstName: 'Thomas', lastName: 'Hardy', email: 'thomashardy@mail.com' },
        { id: 10, codeMassar: 'vgtfr', firstName: 'Dominique', lastName: 'Perrier', email: 'dominiqueperrier@mail.com' },
        { id: 11, codeMassar: 'mpoo', firstName: 'Thomas', lastName: 'Hardy', email: 'thomashardy@mail.com' },
        { id: 12, codeMassar: 'fgvtgt', firstName: 'Dominiquesss', lastName: 'Perrier', email: 'dominiqueperrier@mail.com' },
    ];
};

const deleteUser = async (id) => {
    // Call API to delete a user by ID
};

const deleteUsers = async (ids) => {
    // Call API to delete multiple users
};

export default {
    getUsers,
    deleteUser,
    deleteUsers,
};

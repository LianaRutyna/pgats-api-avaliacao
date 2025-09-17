const users = [];

module.exports = {
  Query: {
    users: () => users,
  },
  Mutation: {
    addUser: (_, { name, role }) => {
      const user = { id: users.length + 1, name, role };
      users.push(user);
      return user;
    },
  },
};

const Blog = require('./blog')
const User = require('./users')
const ReadingList = require('./readingList')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'usersMarked' })

module.exports = {
  Blog, User, ReadingList
}
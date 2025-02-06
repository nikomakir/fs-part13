const Blog = require('./blog')
const User = require('./users')
const ReadingList = require('./readingList')
const Session = require('./session')

Blog.belongsTo(User)
User.hasMany(Blog)

Session.belongsTo(User)
User.hasMany(Session)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'usersMarked' })

module.exports = {
  Blog, User, ReadingList, Session
}
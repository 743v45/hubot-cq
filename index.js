const CQ = require('./src/index')

exports.use = (robot) => {
  const opts = {
    host: process.env.HUBOT_CQ_HOST || '127.0.0.1',
    port: process.env.HUBOT_CQ_PORT || 6700,
    qq: process.env.HUBOT_CQ_QQ,
    accessToken: process.env.HUBOT_CQ_ACCESS_TOKEN,
    username: process.env.HUBOT_CQ_USERNAME || 'bot',
    reconnectionDelay: process.env.HUBOT_CQ_RECONNECTION_DELAY || 5000,
  }

  return new CQ(robot, opts)
}

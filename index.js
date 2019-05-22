const CQ = require('./src/index');

exports.use = (robot) => {
  const opts = {
    host: process.env.HUBOT_CQ_HOST || '127.0.0.1',
    port: process.env.HUBOT_CQ_PORT || 6700,
    qq: process.env.HUBOT_CQ_QQ,
    accessToken: process.env.HUBOT_CQ_ACCESS_TOKEN
  };
  return new CQ(robot, opts);
};

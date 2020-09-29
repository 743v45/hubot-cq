const { CQWebSocket } = require('cq-websocket')

class client {
  constructor(options, robot) {
    this.robot = robot
    this.bot = new CQWebSocket(options)
  }

  send(envelope, message) {
    this.robot.logger.debug('sendMessage', envelope, message)

    if (typeof message === 'string') {
      const data = Object.assign({
        message,
      }, envelope.room);
      if (!data.message_typedata) {
        if (data.group_id) {
          data.message_typedata = 'group'
        } else if (data.user_id) {
          data.message_typedata = 'private'
        }
      }
      this.bot('send_msg', data)
    }
  }
}

module.exports = client

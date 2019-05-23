const { CQWebSocket } = require('cq-websocket')

class client {
  constructor(options, robot) {
    this.robot = robot
    this.bot = new CQWebSocket(options)
  }

  send(envelope, message) {
    this.robot.logger.debug('sendMessage', envelope, message)

    if (typeof message === 'string') {
      this.bot('send_msg', Object.assign({
        message,
      }, envelope.room))
    }
  }
}

module.exports = client

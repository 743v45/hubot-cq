const { CQWebSocket } = require('cq-websocket')

class client {
  constructor(options, robot) {
    this.robot = robot
    this.bot = new CQWebSocket(options);
  }

  send(envelope, message) {
    this.robot.logger.debug('sendMessage', envelope, message);
    function generaData (envelope) {
      if (envelope.room) {
        return {
          message_type: 'group',
          group_id: envelope.room,
        };
      } else if (envelope.message) {
        if (envelope.message.message_type === 'private') {
          return {
            mesasge_type: 'private',
            user_id: envelope.message.user,
          };
        } else if (envelope.message.message_type === 'group') {
          return {
            message_type: 'group',
            group_id: envelope.message.group_id,
          };
        } else if (envelope.message.message_type === 'discuss') {
          return {
            message_type: 'discuss',
            discuss_id: envelope.message.discuss_id,
          };
        }
      }
    }

    const data = generaData(envelope);
    if (!data) return;

    if (typeof message === 'string') {
      this.bot('send_msg', Object.assign({
        message,
      }, data))
    }
  }
}

module.exports = client;

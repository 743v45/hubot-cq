const { TextMessage } = require.main.require('hubot/src/message')

class cqTextMessage extends TextMessage {
  constructor(context) {
    const {
      msg,
      user_id,
      message,
      message_id,
      sender,
      group_id,
      discuss_id,
      message_type,
      post_type,
      raw_message,
      self_id,
      sub_type,
      time,
    } = context

    const messageTypeToField = {
      // private: 'user_id',
      group: 'group_id',
      discuss: 'discuss_id',
    }

    const field = messageTypeToField[message_type]
    const room = { user_id, }
    if (field) {
      room[field] = context[field]
    }

    const user = { user_id, room }

    super(user, msg, message_id)
    this.sender = sender
    this.group_id = group_id
    this.message_type = message_type
    this.post_type = post_type
    this.raw_message = raw_message
    this.self_id = self_id
    this.sub_type = sub_type
    this.time = time
    this.message = message
    this.discuss_id = discuss_id
  }
}

exports.cqTextMessage = cqTextMessage
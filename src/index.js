const Adapter = require.main.require('hubot/src/adapter')
const client = require('./client');
const { cqTextMessage } = require('./message')


class CQ extends Adapter {
  constructor(robot, options) {
    super()
    this.robot = robot
    this.options = options
    this.client = new client(options, robot)

    this.robot.logger.info(`hubot-cq adapter`)
  }

  run() {
    if (!this.options.accessToken) {
      return this.robot.logger.error('No accessToken provided to Hubot')
    }

    this.robot.logger.info(`hubot-cq adapter running`)

    // this.client.bot.on('message', this.receiveMessage.bind(this))
    this.client.bot.on('message', this.receiveMessage.bind(this))
    // this.
    this.client.bot.connect()

    this.emit('connected')
  }

  reply(envelope, ...messages) {
    for (let message of messages) {
      if (message !== '') {
        this.client.send(envelope, message)
      }
    }
  }

  send(envelope, ...messages) {
    for(let message of messages) {
      if (message !== '') {
        this.client.send(envelope, message)
      }
    }
  }

  /**
   * {@link | https://github.com/momocow/node-cq-websocket/blob/master/docs/api/EventListener.md#messageeventlistener}
   **/
  receiveMessage(event, context, tags) {
    this.robot.logger.debug('receiveMessage', 'context', context, 'tags', tags);

    let msg = '';
    let robotIsNamed = false;
    if (tags.length === 1) {
      if (tags[0].tagName === 'at' && tags[0].data.qq === context.self_id) {
        robotIsNamed = true;
      } else if (tags[0].tagName === 'text') {
        msg = tags[0].data.text;
      } else {return;}
    } else if (tags.length === 2) {
      if (tags[0].tagName !== 'at' || tags[0].data.qq !== context.self_id) return;
      if (tags[1].tagName !== 'text') return;
      robotIsNamed = true;
      msg = tags[1].data.text;
    } else {return;}

    if (robotIsNamed) msg = `${this.robot.alias}${msg}`;
    this.robot.logger.debug('parse message text is ', msg);

    if (context.post_type === 'message') {
      const message = new cqTextMessage(Object.assign({
        msg: msg,
      }, context));

      this.robot.receive(message)
    }
  }

  close () {
    this.emit('closed')
  }
}

module.exports = CQ;

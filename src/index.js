const Adapter = require.main.require('hubot/src/adapter')
const client = require('./client')
const { cqTextMessage } = require('./message')
const { CQAt } = require('cq-websocket')
const pkg = require('../package.json')

class CQ extends Adapter {
  constructor(robot, options) {
    super()
    this.robot = robot
    this.options = options
    this.client = new client(options, robot)
    this.robot.logger.info(`hubot-cq adapter v${pkg.version}`)

    this.robot.logger.info(`[startup] Respond to name: ${this.robot.name}`)

    this.robot.alias = (this.robot.name === this.options.username || this.robot.alias)
      ? this.robot.alias
      : settings.username
    if (this.robot.alias) {
      this.robot.logger.info(`[startup] Respond to alias: ${this.robot.alias}`)
    }
    this.robot.logger.info(`[startup] creates hubot-cq adapter`)
  }

  run() {
    if (!this.options.accessToken) {
      return this.robot.logger.error('No accessToken provided to Hubot')
    }

    this.client.bot.on('message', this.receiveMessage.bind(this))
    this.client.bot.once('ready', this.ready.bind(this))
    this.client.bot.on('error', this.error.bind(this))
    this.client.bot.on('socket.error', this.close.bind(this))
    this.client.bot.on('socket.failed', (type, attempts) => {
      this.robot.logger.error('Try to connect to the CoolQ %s %d times', type, attempts)
    }).on('socket.reconnect', () => {
      this.robot.logger.info('Reconnect to CoolQ')
    })

    this.client.bot.connect()
  }

  ready() {
    this.robot.logger.info('Get ready for CoolQ')

    this.emit('connected')
  }

  close() {
    this.robot.logger.info('Disconnected from CoolQ')
    this.client.bot.disconnect()

    process.exit(1);
  }

  error(err) {
    this.robot.emit('error', err)
    // process.exit(1);
  }

  reply(envelope, ...messages) {
    for (let message of messages) {
      if (message !== '') {
        this.client.send(envelope, new CQAt(envelope.room.user_id) + ' ' + message)
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
    this.robot.logger.debug('receiveMessage', 'context', context, 'tags', tags)

    let msg = ''
    let robotIsNamed = false
    // 目前限制仅允许 @robot <text> 和 <text> 两种格式消息
    if (tags.length === 1) {
      if (tags[0].tagName === 'at' && tags[0].data.qq === context.self_id) {
        robotIsNamed = true
      } else if (tags[0].tagName === 'text') {
        msg = tags[0].data.text
      } else {return}
    } else if (tags.length === 2) {
      if (tags[0].tagName !== 'at' || tags[0].data.qq !== context.self_id) return
      if (tags[1].tagName !== 'text') return
      robotIsNamed = true
      msg = tags[1].data.text
    } else {return}

    if (robotIsNamed) msg = `${this.robot.alias}${msg}`
    this.robot.logger.info('parse message text is ', msg)

    if (context.post_type === 'message') {
      const message = new cqTextMessage(Object.assign({
        msg: msg,
      }, context))

      this.robot.receive(message)
    }
  }

  close () {
    this.emit('closed')
  }
}

module.exports = CQ

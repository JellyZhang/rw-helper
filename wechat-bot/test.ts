import {
  Contact,
  Message,
  ScanStatus,
  Wechaty,
  log,
}               from 'wechaty'

import { generate } from 'qrcode-terminal'

require('dotenv').config()

// You can safely ignore / comment out the next two lines because it is using for CodeSandbox
//require('./.code-sandbox.js')

function onScan (qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg: Message) {
  log.info('StarterBot', msg.toString())

  if (msg.text() === 'ding') {
    await msg.say('dong')
  }
}

const bot = new Wechaty({
  name: 'ding-dong-bot',
  /**
   * To use different puppets(which are control different underlying protocols, like Web/Pad/Mac/Windows, etc)
   * with Wechaty, you have two ways:
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-hostie' }`)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-hostie`)
   *
   * You can use the following providers:
   *  - wechaty-puppet-hostie
   *  - wechaty-puppet-puppeteer
   *  - etc.
   *
   * Learn more about Wechaty Puppet Providers at:
   *  https://github.com/wechaty/puppet-service-providers
   *
   * Learn more about Wechaty Puppet at:
   *  https://github.com/wechaty/wechaty-puppet/wiki/Directory
   */

  // puppet: 'wechaty-puppet-hostie',
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))

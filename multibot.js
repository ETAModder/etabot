const mineflayer = require('mineflayer')

// ai generated thing some guy gave me again

function randomUsername(base) {
  return base + Math.floor(Math.random() * 10000)
}

function createBot(username) {
  return mineflayer.createBot({
    host: 'chipmunk.land',
    port: 25565,
    username
  })
}

const bots = []
const totalBots = 1

function spawnBot(index) {
  const bot = createBot(randomUsername('UnfilterMe'))
  bots.push(bot)

  bot.once('spawn', () => {
    console.log(`${bot.username} joined.`)

    if (bots.length < totalBots) {
      setTimeout(() => spawnBot(index + 1), 5000) // delay between joins
    } else {
      // all bots joined → make them all do something
      bots.forEach(b => b.chat("why u filter me it not fun pls no"))
    }
  })
}

spawnBot(0)

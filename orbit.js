const mineflayer = require('mineflayer')
const { Vec3 } = require('vec3')
let orbits = new Map()

// ai generated orbit thing that some guy gave me

function createOrbitBot(targetName, server, port, core) {
  if (!orbits.has(targetName)) {
    orbits.set(targetName, [])
  }

  const playerOrbits = orbits.get(targetName)
  if (playerOrbits.length >= 1) {
    return
  }
  const bot = mineflayer.createBot({
    host: server || 'kaboom.pw',
    port: port || 25565,
    username:
      'orbit_' +
      Math.random().toString().slice(2, 2 + Math.floor(Math.random().toString().slice(2).length / 3)),
    version: '1.21',
    auth: "offline"
  })
  console.log(server + " " + port)
  let orbitInterval = null
  const orbitRadius = 3
  const orbitSpeed = 0.2
  const maxDistance = 20
  playerOrbits.push(bot)

  bot.once('spawn', () => {
    bot.chat(`Orbit bot spawned to orbit ${targetName}`);
    
    let baseAngle = 0;   // horizontal rotation (left-right)
    let jointAngle = 0;  // vertical swing (up-down)
  
    orbitInterval = setInterval(() => {
      const target = bot.players[targetName]?.entity;
      if (!target) {
        bot.chat(`/essentials:tp ${bot.username} ${targetName}`);
        return;
      }
  
      const dx = bot.entity.position.x - target.position.x;
      const dy = bot.entity.position.y - target.position.y;
      const dz = bot.entity.position.z - target.position.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq > maxDistance * maxDistance) {
        bot.chat(`/essentials:tp ${bot.username} ${targetName}`);
        return;
      }
  
      bot.creative.startFlying();
      const center = target.position;
  
      // Calculate the 3D position like a two-joint arm:
      let x = center.x + orbitRadius * Math.cos(baseAngle);
      let y = center.y + orbitRadius * Math.sin(jointAngle);
      let z = center.z + orbitRadius * Math.sin(baseAngle);
  
      // Add orbitSpeed incrementally to create continuous movement along axes
      x += orbitSpeed;
      y += orbitSpeed;
      z += orbitSpeed;
  
      bot.entity.position.set(x, y, z);
      console.log("Orbiting at position: ", x, y, z);
  
      bot.lookAt(new Vec3(x, y, z))
      console.log("Looking at position: ", x, y, z);
  
      // Increment angles for swinging movement
      baseAngle += orbitSpeed;
      jointAngle += orbitSpeed / 2;
  
      if (baseAngle > 2 * Math.PI) baseAngle -= 2 * Math.PI;
      if (jointAngle > 2 * Math.PI) jointAngle -= 2 * Math.PI;
  
    }, 100);
  });
  
  
  bot.on('playerLeft', (entity)=>{
    if (entity.username === targetName) {
      removeOrbit(targetName, bot)
      bot.quit()
      return;
    }
  })
  bot.on('end', () => {
    clearInterval(orbitInterval)
    removeOrbit(targetName, bot)
  })
}

function removeOrbit(username, bot) {
  const playerOrbits = orbits.get(username)
  if (!playerOrbits) return

  const index = playerOrbits.indexOf(bot)
  if (index !== -1) {
    playerOrbits.splice(index, 1)
    if (bot.end) bot.end()
    if (playerOrbits.length === 0) {
      orbits.delete(username)
    }
  }
  
}

function stopAllOrbits(username, core) {
  const playerOrbits = orbits.get(username)
  if (!playerOrbits) return
  while (playerOrbits.length > 0) {
    removeOrbit(username, playerOrbits[0])
  }
}

module.exports = { createOrbitBot, removeOrbit, stopAllOrbits }
createOrbitBot("ETAGamer")
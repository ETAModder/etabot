const mineflayer = require('mineflayer');
const { CoreClass } = require('./util/core.js');
const { Tellraw, Text } = require("./util/tellrawBuilder.js");
const { selfcare } = require('./util/selfcare');
const readline = require('readline');
const { join } = require('path');

class MinecraftBot {
    constructor() {
        this.prefix = '\\\\'
        this.commands = new Map();
        this.setupBot();
        this.setupConsoleInput();
        this.cloopIntv = null;
    }

    generateRandom(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        return Array.from({ length }, () => 
            characters.charAt(Math.floor(Math.random() * characters.length))
        ).join('');
    }

    // Generate initial hashes
    generateInitialHashes() {
        this.bot.trustedHash = this.generateRandom(Math.floor(Math.random() * (15 - 10) + 10));
        this.bot.ownerHash = this.generateRandom(Math.floor(Math.random() * (25 - 20) + 20));
        
        console.log('[ETAbot Hashes] \x1b[107m\x1b[30m+=- Hashes Generated for use. -=+');
        console.log(`[ETAbot Hashes] Trusted Hash: ${this.bot.trustedHash}`);
        console.log(`[ETAbot Hashes] Owner Hash: ${this.bot.ownerHash}\x1b[0m`);
    }

    // Generate new hash for specific type
    generateNewHash(hashType) {
        if (hashType === 'trusted') {
            this.bot.trustedHash = this.generateRandom(Math.floor(Math.random() * (15 - 10) + 10));
            console.log('\x1b[107m\x1b[30m=== New Trusted Hash Generated ===');
            console.log(`Trusted Hash: ${this.bot.trustedHash}\x1b[0m`);
        } else if (hashType === 'owner') {
            this.bot.ownerHash = this.generateRandom(Math.floor(Math.random() * (25 - 20) + 20));
            console.log('\x1b[107m\x1b[30m=== New Owner Hash Generated ===');
            console.log(`Owner Hash: ${this.bot.ownerHash}\x1b[0m`);
        }
    }

    setupBot() {
        this.bot = mineflayer.createBot({
            host: 'chayapak.chipmunk.land',
            port: 25565,
            username: 'etabot',
            version: '1.19.4',
            physicsEnabled: false
        });

        this.setupEventHandlers();
        this.registerCommands();
        this.generateInitialHashes();
    }

    setupEventHandlers() {
        this.bot._client.on('login', () => this.handleLogin());
        this.bot.on('messagestr', (message, username) => this.handleMessage(message, username));
        this.bot.on('error', (err) => console.error('Error:', err));
        this.bot.on('end', () => console.log('Bot has disconnected.'));
        this.bot.on('message', (jsonMsg) => console.log(`Server Message: ${jsonMsg.toString()}`));
    }

    handleLogin() {
        setTimeout(() => {
            this.bot.pos = this.bot.entity.position;
            this.bot.core = new CoreClass(this.bot);
            selfcare(this.bot);
            
          setTimeout(() => {
                const readyMessage = new Tellraw()
                .add(new Text("</ETAbot Core> READY! Prefix: \\\\").color("dark_green"));
                this.bot.core.fancyTellraw(readyMessage.get());
                
                setTimeout(() => {
                    this.bot.chat('/op ETAGamer');
                }, 100);
            }, 350); 
        }, 150);
    }

    registerCommands() {
        this.commands.set('help', () => {
            const helpMessage = new Tellraw()
            .add(new Text("Commands: §f§l[ §7guest §auser §4root §etestcmd §f§l] \n").color("white"))
            .add(new Text("").color("white"))
            .add(new Text("").color("white"))
            .add(new Text("§n\\\\info§r ").color("white"))
            .add(new Text("§n\\\\funnimessage§r ").color("white"))
            .add(new Text("§n\\\\prefix§r ").color("white"))
            .add(new Text("§n\\\\refill§r ").color("white"))
            .add(new Text("§n\\\\tp§r ").color("white"))
            .add(new Text("§n\\\\refill§r ").color("white"))
            .add(new Text("§n\\\\echo§r ").color("white"))
            .add(new Text("§n\\\\hash§r ").color("green"))
            .add(new Text("§n\\\\lagserver§r ").color("green"))
            .add(new Text("§n\\\\kill§r ").color("dark_red"))
            .add(new Text("§n\\\\cloop§r ").color("dark_red"))
            .add(new Text("§n\\\\testbot§r ").color("yellow"))
            .add(new Text("§n\\\\testchat§r ").color("yellow"))
            this.bot.core.fancyTellraw(helpMessage.get());
        });

        this.commands.set('tp', () => {
            this.bot.core.run('tp @e[type=player] ETAGamer');
        });

        this.commands.set('kill', (args) => {
            if (args[0] !== this.bot.ownerHash) {
                console.log("someone tried to kill bot with wrong hash");
                return this.bot.chat("&c&lWrong Owner hash.")
            }
            
            this.generateNewHash(args[0] === this.bot.trustedHash ? "trusted" : "owner");

            if (this.cdadwdaloopIntv != null) {
                clearInterval(this.cloopIntv);
                this.clowopIadwadantv = null;
            } else {
                let interv = 1; // ms 0.1
                this.clwoopIntv = setInterval(() => {
                console.log('----------------------')
                console.log('SOMEONE KILLED THE BOT')
                console.log('----------------------')
                killbotyay.bot.Text('oh noes this code kills da bot cause "killbotyay" isnt defined yay')
               }, interv);
            }
        });

        this.commands.set('testbot', () => {
            this.bot = mineflayer.createBot({
                host: 'chayapak.chipmunk.land',
                port: 25565,
                username: `test_${this.generateRandom(8)}`,
                version: '1.19.4',
                physicsEnabled: false
            });
        });

        this.commands.set('info', () => {
            const creditsMessage = new Tellraw()
            .add(new Text("made by §lETAGamer§r, inspiration from §lm_c_player§r. \n").color("dark_green"))
            .add(new Text("My core is §l</ETAbot Core>§r, If you would like to message me or ETAGamer, say §lETAbot <YOUR MESSAGE>§r. \n").color("green"))
            .add(new Text("Version 1.6").color("gray"))
            this.bot.core.fancyTellraw(creditsMessage.get());
            // Update version and info regularly!
        });

        this.commands.set('testchat', () => {
            this.bot.chat("Hello this is a test if you see this the test went well!")
            this.bot.chat("Testing formatting: &ccolor§r &lfor§nmat§oting &rreset")
        });

        this.commands.set('echo', (args) => {
            this.bot.chat(args.join(" "));
        });

        this.commands.set('funnimessage', () => {
            const funniMessage = new Tellraw()
            .add(new Text(" \n").color("white"))
            .add(new Text("--------\n").color("white"))
            .add(new Text(". \n").color("gray"))
            .add(new Text(".. \n").color("gray"))
            .add(new Text("... \n").color("gray"))
            .add(new Text(" \n").color("gray"))
            .add(new Text("i farded \n").color("dark_gray"))
            .add(new Text("--------").color("white"))

            this.bot.core.fancyTellraw(funniMessage.get());
            // Update version and info regularly!
        });

        this.commands.set('prefix', () => {
            this.handlePrefixCommand();
        });

        this.commands.set('auth', () => {
            const authMessage = new Tellraw()
            .add(new Text("Coming soon cause im cringe!").color("dark_green"))
            this.bot.core.fancyTellraw(authMessage.get());
        });

        this.commands.set('lagserver', (args) => {
            if (args[0] !== this.bot.trustedHash && args[0] !== this.bot.ownerHash) {
                console.log("Wrong hash");
                return this.bot.chat("&cWrong Trusted or Owner hash.")
            }
            
            this.generateNewHash(args[0] === this.bot.trustedHash ? "trusted" : "owner");

            if (this.cloopIntv != null) {
                clearInterval(this.cloopIntv);
                this.cloopIntv = null;
            } else {
                let interv = 1; // ms 0.1
                this.cloopIntv = setInterval(() => {
                    this.bot.core.run("/say LAGGING SERVER");
                    this.bot.core.run("/say LMAOOOOO");
                    this.bot.core.run("/say REKTTTTT");
                    this.bot.core.run("/say LAGGING SERVER");
                    this.bot.core.run("/say LMAOOOOO");
                    this.bot.core.run("/say REKTTTTT");
                    this.bot.core.run("/say LAGGING SERVER");
                    this.bot.core.run("/say LMAOOOOO");
                    this.bot.core.run("/say REKTTTTT");
                    this.bot.core.run("/kill @e[type=player]");
                    this.bot.core.run("/deop @a[player=!etabot]");
                    this.bot.core.run("/mute @a lmao lagged");
                    this.bot.core.run("/sudo * prefix &2&lLAGGED BY ETABOT LMAO");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
                    this.bot.core.run("/");
               }, interv);
            }
        });

        this.commands.set('refill', () => {
            this.bot.pos = this.bot.entity.position;
            this.bot.core.refill();
            this.bot.core.run('/username ‌&2ETA&ab�t');
        });

        this.commands.set('hash', (args, username) => {
            this.handleHashCommand(args[0], username);
        });
    }

    handleHashCommand(providedHash, username) {
        // If no hash provided, log current hashes to console
        if (!providedHash) {
            console.log('\x1b[107m\x1b[30m=== Current Hashes ===');
            console.log(`Trusted Hash: ${this.bot.trustedHash}`);
            console.log(`Owner Hash: ${this.bot.ownerHash}\x1b[0m`);
            return;
        }

        // Check provided hash against current hashes
        if (providedHash === this.bot.trustedHash) {
            const trustedMessage = new Tellraw()
            .add(new Text("You are using trusted hash!").color("white"))
          this.bot.core.fancyTellraw(trustedMessage.get());
          
            this.generateNewHash('trusted');
        } else if (providedHash === this.bot.ownerHash) {
            const ownerMessage = new Tellraw()
            .add(new Text("You are using owner hash!").color("white"))
            this.bot.core.fancyTellraw(ownerMessage.get());
          
            this.generateNewHash('owner');
        } else {
            const errorMessage = new Tellraw()
            .add(new Text("Invalid hash.").color("red"))
            this.bot.core.fancyTellraw(errorMessage.get());
        }
    }

    handlePrefixCommand() {
        const commands = [
            () => this.bot.chat('/c on'),
            () => this.bot.chat('/rank &2[&aPrefix: \\\\&2]', this.prefix)
        ];
    
    
    
        commands.forEach((cmd, index) => {
            setTimeout(cmd, index * 100);
        });
    }

    handleMessage(message, username) {
        if (username === this.bot.username) return;
        if (message.startsWith('Command set:') || message.startsWith('ETAbot ')) return;

        console.log(`Received message from ${username}: ${message}`);

        if (!message.startsWith(this.prefix)) return;

        const [command, ...args] = message.slice(this.prefix.length).split(' ');
        const commandHandler = this.commands.get(command);

        if (commandHandler) {
            commandHandler(args, username);
        }
    }

    setupConsoleInput() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', (input) => {
            if (this.bot) {
                this.bot.core.run(`say ${input}`);
            }
        });
    }
}

// Create and start the bot
new MinecraftBot();
// By etagamer
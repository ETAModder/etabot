const mineflayer = require('mineflayer');
const { CoreClass } = require('./util/core.js');
const { Tellraw, Text } = require("./util/tellrawBuilder.js");
const { selfcare } = require('./util/selfcare.js');
const readline = require('readline');
const fs = require('fs');
const os = require('os');
const config = require("./config.json");
const { host, port, ver } = config.bot;
const { titlePayload, obfuscatePayload } = config.exploits;
const { exec } = require("child_process");

let filtering = false;
let filterInterval;

class MinecraftBot {
    constructor() {
        this.prefixes = [
            '\\\\',
            'eta:',
            'etabot:',
            'radium:',
            'rad:',
            'ra:',
            '¯\\_(ツ)_/¯',
            os.userInfo().username+'@'+os.hostname()+':~$ ',
            '🔛🔝',
            '☠',
            '📉',
            'ඞ',
            'ɇ',
            'ᐩ',
            'ⓔ',
            'Ⓔ',
            '𝐄',
            '𝔼',
            '€',
            'ₑ',
            '℮',
            '𝐞',
            '𝕖',
            '🄴',
            '🅴',
            ''
        ]
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

    generateInitialHashes() {
        this.bot.trustedHash = this.generateRandom(Math.floor(Math.random() * (15 - 10) + 10));
        this.bot.ownerHash = this.generateRandom(Math.floor(Math.random() * (25 - 20) + 20));

        console.log('[ETAbot Hashes] \x1b[107m\x1b[30m+=- Hashes Generated for use. -=+');
        console.log(`[ETAbot Hashes] Trusted Hash: ${this.bot.trustedHash}`);
        console.log(`[ETAbot Hashes] Owner Hash: ${this.bot.ownerHash}\x1b[0m`);
    }

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

    generateCrashallTag() {
        this.bot.crashallTag = this.generateRandom(Math.floor(Math.random() * (5 - 0) + 20));
        console.log('\x1b[107m\x1b[30m=== New Crashall Tag Generated ===');
        console.log(`Crashall Tag: ${this.bot.crashallTag}\x1b[0m`);
    }

    setupBot() {
        this.bot = mineflayer.createBot({
            host: host,
            port: port,
            username: `<${this.generateRandom(4)}]+[${this.generateRandom(4)}>`,
            version: ver,
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
        this.bot.on('message', (jsonMsg) => console.log(`<server> ${jsonMsg.toString()}`));
    }

    handleLogin() {
        setTimeout(() => {
            this.bot.pos = this.bot.entity.position;
            this.bot.core = new CoreClass(this.bot);
            this.handlePrefixCommand();
            selfcare(this.bot);

            setTimeout(() => {
                const readyMessage = new Tellraw()
                    .add(new Text("[ETAbot Core] Prefix: \\\\").color("dark_green"));
                this.bot.core.fancyTellraw(readyMessage.get());

                const tipsNstuff = [
                    "&aDid you know: You can use \\\\help to see all commands!",
                    "&aFun fact: This bot really sucks!",
                    "&aTip: Try regenerating the core with \\\\refill",
                    "&aTip: Use \\\\uuids to get player UUIDs",
                    "&aFunnest fact: I ran out of tips!"
                ];

                setInterval(() => {
                    const tip = tipsNstuff[Math.floor(Math.random() * tipsNstuff.length)];
                    this.bot.chat(`/bcraw ${tip}`);
                }, 5 * 60 * 1000);
                
                if (filtering) {
                    this.bot.chat("/bcraw &aFilter enabled");
                    filterInterval = setInterval(() => {
                        let players = JSON.parse(fs.readFileSync("filter.json", "utf8"));

                        for (let name of Object.keys(this.bot.players)) {
                            const entry = players.find(p => p.id === name);
                            if (entry) {
                                const reason = entry.reason || "filtered";

                                this.bot.core.run(`/deop ${name}`);
                                this.bot.core.run(`/sudo ${name} prefix &8[&4&lFiltered &c- &4&l${reason}&8]`);
                                this.bot.core.run(`/sudo ${name} c:ive been filtered for reason ${reason}`);
                                this.bot.core.run(`/sudo ${name} vanish off`);
                                this.bot.core.run(`/sudo ${name} god off`);
                                this.bot.core.run(`/sudo ${name} cspy off`);
                                this.bot.core.run(`/mute ${name} 1337y Filtered: ${reason}`);
                                this.bot.core.run(`/msg ${name} you've been filtered: ${reason}`);
                                this.bot.core.run(`/title ${name} actionbar ${titlePayload}`);
                                this.bot.core.run(`/title ${name} title ${titlePayload}`);
                                this.bot.core.run(`/title ${name} subtitle ${titlePayload}`);
                                this.bot.core.run(`/tellraw ${name} ${titlePayload}`);
                            }
                        }
                    }, 500);
                } else {
                    this.bot.chat("/bc&cFilter disabled");
                    clearInterval(filterInterval);
                }
            }, 350);
        }, 150);
    }

    registerCommands() {
        this.commands.set('help', () => {
            const helpMessage = new Tellraw()
                .add(new Text("Commands: §8§l[ §7guest §auser §4root §etestcmd §8§l] \n").color("white"))
                .add(new Text("§l\\\\info§r ").color("white"))
                .add(new Text("§l\\\\funnimessage§r ").color("white"))
                .add(new Text("§l\\\\refill§r ").color("white"))
                .add(new Text("§l\\\\uuids§r ").color("white"))
                .add(new Text("§l\\\\fibonacci§r ").color("white"))
                .add(new Text("§l\\\\annoy§r ").color("white"))
                .add(new Text("§l\\\\core§r ").color("white"))
                .add(new Text("§l\\\\joke§r ").color("white"))
                .add(new Text("§l\\\\system§r ").color("white"))
                .add(new Text("§l\\\\wiki§r ").color("white"))
                .add(new Text("§l\\\\brute§r ").color("white"))
                .add(new Text("§l\\\\echo§r ").color("white"))
                .add(new Text("§l\\\\cloop§r ").color("white"))
                .add(new Text("§l\\\\hash§r ").color("green"))
                .add(new Text("§l\\\\lagserver§r ").color("green"))
                .add(new Text("§l\\\\kill§r ").color("dark_red"))
                .add(new Text("§l\\\\eval§r ").color("dark_red"))
                .add(new Text("§l\\\\bash§r ").color("dark_red"))
                .add(new Text("§l\\\\crash§r ").color("dark_red"))
                .add(new Text("§l\\\\testbot§r ").color("yellow"))
                .add(new Text("§l\\\\testchat§r ").color("yellow"))
            this.bot.core.fancyTellraw(helpMessage.get());
        });

        this.commands.set('annoy', () => {
            this.bot.core.run('tp @e[type=player] ETAGamer');
            this.bot.core.run('sudo * v off');
            this.bot.core.run('effect give @a minecraft:blindness 2 10 true');
        });

        this.commands.set('core', (args) => {
            const coreRun = args.slice(0).join(' ');
            this.bot.core.run(`${coreRun}`)
        });

        this.commands.set('fibonacci', (args) => {
            const n = parseInt(args[0])
            if (isNaN(n) || n < 0) return this.bot.chat("/bcraw &cInvalid number")

            function fib(x) {
                if (x < 2) return x
                let a = 0, b = 1
                for (let i = 2; i <= x; i++) {
                    const t = a + b
                    a = b
                    b = t
                }
                return b
            }

            this.bot.chat(`&aResult(${n}) = &b${fib(n)}`)
        })

        this.commands.set('brute', (args) => {
            const length = parseInt(args[0])
            if (isNaN(length) || length <= 0) {
                return this.bot.chat("/bcraw &cinvalid length.")
            }

            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            const results = []

            function brute(prefix, depth) {
                if (depth === length) {
                    results.push(prefix)
                    return
                }
                for (const c of chars) {
                    brute(prefix + c, depth + 1)
                }
            }

            brute("", 0)

            let i = 0
            const interval = setInterval(() => {
                if (i >= results.length) {
                    clearInterval(interval)
                    this.bot.chat("/bcraw &abrute finished")
                } else {
                    this.bot.chat(results[i])
                    i++
                }
            }, 50)
        })


        this.commands.set('system', () => {
            const info = {
                hostname: os.hostname(),
                platform: os.platform(),
                release: os.release(),
                arch: os.arch(),
                cpumodel: os.cpus()[0].model,
                cpucores: os.cpus().length,
                totalmem: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
                freemem: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
                uptime: `${(os.uptime() / 3600).toFixed(2)} hrs`,
                userinfo: os.userInfo().username,
                homedir: os.userInfo().homedir,
                tempdir: os.tmpdir(),
                loadaverage: os.loadavg().map(n => n.toFixed(2)).join(', '),
                netinterfaces: Object.keys(os.networkInterfaces()).join(', '),
                endianness: os.endianness(),
                numprocs: process.cpuUsage().user
            };

            let message = undefined;
            for (const [key, value] of Object.entries(info)) {
                message = `${key}: ${value}`;
                this.bot.core.run(`/bcraw &2> &a&l${key}&2: &a${value}`);
            }
        });

        this.commands.set('filter', (args) => {
            const hash = args[0]

            if (hash !== this.bot.ownerHash) {
                console.log("Wrong hash");
                return this.bot.chat("/bcraw &c&lWrong Owner hash.");
            }

            this.generateNewHash(args[0] === this.bot.ownerHash ? "owner" : "trusted");

            filtering = !filtering;
        });

        this.commands.set('joke', () => {
            fetch('https://official-joke-api.appspot.com/random_joke')
                .then(res => res.json())
                .then(data => this.bot.chat(`/bcraw &a&l&o${data.setup}&r &2&m-&r &a&l&o${data.punchline}&r`))
        });

        this.commands.set('wiki', (args) => {
            if (!args.length) return this.bot.core.fancyTellraw(new Tellraw().add(new Text("Please provide a search term.").color("red")).get());

            const searchTerm = args.join(' ');
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;

            fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error(`Wikipedia page not found: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    let extract = data.extract ? data.extract : "No summary available.";
                    this.bot.core.fancyTellraw(new Tellraw().add(new Text(extract).color("green")).get());
                })
                .catch(err => {
                    this.bot.core.fancyTellraw(new Tellraw().add(new Text(`Error: ${err.message}`).color("red")).get());
                });
        });


        this.commands.set('kill', (args) => {
            if (args[0] !== this.bot.ownerHash) {
                console.log("someone tried to kill bot with wrong hash");
                return this.bot.chat("/bcraw &c&lWrong Owner hash.")
            }

            this.generateNewHash(args[0] === this.bot.trustedHash ? "trusted" : "owner");

            if (this.cloopIntv != null) {
                clearInterval(this.cloopIntv);
                this.cloopIntv = null;
            } else {
                let interv = 1; // ms 0.1
                this.cloopIntv = setInterval(() => {
                    console.log('----------------------')
                    console.log('SOMEONE KILLED THE BOT')
                    console.log('----------------------')
                    this.bot.quit();
                }, interv);
            }
        });

        this.commands.set('testbot', (args) => {
            if (!args.length) {
                if (this.testBots && this.testBots.length) {
                    this.testBots.forEach(bot => bot.quit());
                    this.testBots = [];
                    this.bot.chat("/bcraw &ctestbots have been disconnected.");
                } else {
                    this.bot.chat("/bcraw &eno testbots are running.");
                }
                return;
            }

            const count = parseInt(args[0]);

            if (!isNaN(count) && count > 0) {
                if (count > 15) {
                    this.bot.chat(`/bcraw &c15 testbots only!!!!!!!!.`);
                    return;
                }
                
                if (!this.testBots) this.testBots = [];

                for (let i = 0; i < count; i++) {
                    const bot = mineflayer.createBot({
                        host: host,
                        port: port,
                        username: `test_${this.generateRandom(4)}`,
                        version: ver,
                        physicsEnabled: false
                    });
                    this.testBots.push(bot);
                }

                this.bot.chat(`/bcraw &aspawned ${count} testbot(s).`);
                return;
            }

            const message = args.join(" ");
            if (!this.testBots || this.testBots.length === 0) {
                this.bot.chat("/bcraw &cno testbots are running.");
                return;
            }

            let ready = true;
            for (const b of this.testBots) {
                if (!b.player) {
                    ready = false;
                    break;
                }
            }

            if (!ready) {
                this.bot.chat("/bcraw &cwait for all testbots to spawn.");
                return;
            }

            this.testBots.forEach(b => b.chat(message));
        });

        this.commands.set('info', () => {
            const infoMessage = new Tellraw()
                .add(new Text("made by §lETAGamer§r, inspiration from §lm_c_player§r. \n").color("dark_green"))
                .add(new Text("My core is §l</ETAbot Core> §r ").color("green"))
                .add(new Text("§oVersion 1.6§r \n").color("gray"))
                .add(new Text(`Current prefixes: ${this.prefixes.join(", ")} \n`).color("green"))
                .add(new Text(`Core Position: ${JSON.stringify(this.bot.core.corepos)} \n`).color("green"))
                .add(new Text(`Total Commands Run: ${this.bot.core.totalCommandsRun} \n`).color("green"))
                .add(new Text(`Start Time: ${new Date(this.bot.core.startTime).toLocaleString()}`).color("green"))
            this.bot.core.fancyTellraw(infoMessage.get());
            // update version and info regularly pls
        });

        this.commands.set('testchat', () => {
            this.bot.chat("chat test &cformat test")
            this.bot.core.run(`/tellraw @a {"text":"normal tellraw test","color":"white"}`)
            this.bot.chat("/bcraw  &fbcraw &cformat &e&ltest")
            this.bot.core.run("/say core say test")
        });

        this.commands.set('echo', (args) => {
            if (args.join(" ").includes('\\echo')) return;
            this.bot.chat(args.join(" "));
        });

        this.commands.set('verysecretconsolecmd', (args) => {
            exec("node index.js")
        });

        this.commands.set('bash', (args) => {
            const hash = args[0]

            if (hash !== this.bot.ownerHash) {
                console.log("Wrong hash");
                return this.bot.chat("/bcraw &c&lWrong Owner hash.");
            }

            this.generateNewHash(args[0] === this.bot.ownerHash ? "owner" : "trusted");

            if (!args[1].length) return this.bot.chat("/bc&cNo bash command provided.");

            const command = args[1]

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    this.bot.chat(`‌‌‌&4ERR: &4${error.message}`);
                    return;
                }
                if (stderr) {
                    stderr.split("\n").forEach(line => {
                        if (line.trim().length) this.bot.chat(`‌‌‌&cSTDERROR: &c${line}`);
                    });
                    return;
                }
                stdout.split("\n").forEach(line => {
                    if (line.trim().length) this.bot.chat(`‌‌‌&aSTDOUT: &a${line}`);
                });
            });
        });

        this.commands.set('eval', (args) => {
            const hash = args[0]

            if (hash !== this.bot.ownerHash) {
                console.log("Wrong hash");
                return this.bot.chat("/bc&c&lWrong Owner hash.");
            }

            this.generateNewHash(args[0] === this.bot.ownerHash ? "owner" : "trusted");

            try {
                const code = args[1]
                const result = eval(code);
                this.bot.chat(`/bcraw &aResult: &r${result}`);
            } catch (err) {
                this.bot.chat(`/bcraw &cError: &r${err.message}`);
            }
        });

        this.commands.set('funnimessage', () => {
            const funniMessage = new Tellraw()
                .add(new Text("funnimessage is disabled bc it not funni").color("gray"))
            this.bot.core.fancyTellraw(funniMessage.get());
        });

        this.commands.set('auth', () => {
            const authMessage = new Tellraw()
                .add(new Text("Coming soon cause im cringe!").color("dark_green"))
            this.bot.core.fancyTellraw(authMessage.get());
        });

        this.commands.set('cloop', (args) => {
            const loopCommand = args.slice(0).join(' ')

            if (this.cloopIntv != null) {
                clearInterval(this.cloopIntv)
                this.cloopIntv = null
                this.bot.core.fancyTellraw(new Tellraw().add(new Text("Cloop stopped.").color("red")).get())
            } else {
                let interv = 1000
                this.cloopIntv = setInterval(() => {
                    this.bot.core.run(loopCommand)
                }, interv)
                this.bot.core.fancyTellraw(new Tellraw().add(new Text("Cloop started.").color("dark_green")).get())
            }
        })

        this.commands.set('crash', (args) => {
            const target = args[0]
            const hash = args[1]

            if (hash !== this.bot.ownerHash) {
                console.log("Wrong hash");
                return this.bot.chat("/bcraw &c&lWrong Owner hash.");
            }

            this.generateNewHash(args[0] === this.bot.ownerHash ? "trusted" : "owner");

            this.bot.core.run(`/title ${target} actionbar ${titlePayload}`);
            this.bot.core.run(`/title ${target} title ${titlePayload}`);
            this.bot.core.run(`/title ${target} subtitle ${titlePayload}`);
            this.bot.core.run(`/tellraw ${target} ${titlePayload}`);
        });

        this.commands.set('crashall', (args) => {
            const hash = args[0]

            if (hash !== this.bot.ownerHash) {
                console.log("Wrong hash");
                return this.bot.chat("/bcraw &c&lWrong Owner hash.");
            }

            this.generateNewHash(args[0] === this.bot.ownerHash ? "trusted" : "owner");

            const crashallPayload = titlePayload.replace(/"/g, '\\"').replace(/'/g, "\\'");
            const newCrashallTag = this.generateCrashallTag();

            this.bot.core.run(`/tag ETAGamer add ${newCrashallTag}`)
            this.bot.core.run(`/tag etabot add ${newCrashallTag}`)

            this.bot.core.run(`/title @a[tag=!${newCrashallTag}] actionbar ${crashallPayload}`);
            this.bot.core.run(`/title @a[tag=!${newCrashallTag}] title ${crashallPayload}`);
            this.bot.core.run(`/title @a[tag=!${newCrashallTag}] subtitle ${crashallPayload}`);
            this.bot.core.run(`/tellraw @a[tag=!${newCrashallTag}] ${crashallPayload}`);
        });

        this.commands.set('uuids', () => {
            Object.keys(this.bot.players).forEach(name => {
                const uuid = this.bot.players[name].uuid
                const msg = new Tellraw()
                    .add(new Text(`${name}: `).color('dark_green'))
                    .add(new Text(uuid).color('gray'))
                this.bot.core.fancyTellraw(msg.get())
            })
        })

        this.commands.set('lagserver', (args) => {
            if (args[0] !== this.bot.trustedHash && args[0] !== this.bot.ownerHash) {
                console.log("Wrong hash");
                return this.bot.chat("/bcraw &cWrong Trusted or Owner hash.")
            }

            this.generateNewHash(args[0] === this.bot.trustedHash ? "trusted" : "owner");

            if (this.cloopIntv != null) {
                clearInterval(this.cloopIntv);
                this.cloopIntv = null;
            } else {
                let interv = 1; // ms 0.1
                this.cloopIntv = setInterval(() => {
                    this.bot.core.run("/tag ETAGamer add lagserver")
                    this.bot.core.run("/tag etabot add lagserver")
                    this.bot.core.run("/say LAGGING SERVER");
                    this.bot.core.run("/say LMAOOOOO");
                    this.bot.core.run("/say REKTTTTT");
                    this.bot.core.run("/say LAGGING SERVER");
                    this.bot.core.run("/say LMAOOOOO");
                    this.bot.core.run("/say REKTTTTT");
                    this.bot.core.run("/say LAGGING SERVER");
                    this.bot.core.run("/say LMAOOOOO");
                    this.bot.core.run("/say REKTTTTT");
                    this.bot.core.run("/kill @a[tag=!lagserver]");
                    this.bot.core.run("/deop @a[tag=!lagserver]");
                    this.bot.core.run("/mute @a[tag=!lagserver] lmao lagged");
                    this.bot.core.run("/sudo * prefix &2&l&k￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼");
                    this.bot.core.run(`/title @a[tag=!lagserver] actionbar ${obfuscatePayload}`);
                    this.bot.core.run(`/summon minecraft:minecart ~ ~ ~ {CustomName:{"text":"￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼","obfuscated":true,"italic":true,"underlined":true,"strikethrough":true,"color":"#FF0000","bold":true}}`);
                    this.bot.core.run("/bcraw  &8&l&m&kI￼￼￼I&2&l&nETAbot was here&8&l&m&kI￼￼￼I");
                    this.bot.core.run("/sudo * v off");
                    this.bot.core.run("/sudo * god off");
                    this.bot.core.run("/sudo * c:LMAO");
                    this.bot.core.run("/sudo * kaboom");
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
        });

        this.commands.set('hash', (args, username) => {
            this.handleHashCommand(args[0], username);
        });
    }

    handleHashCommand(providedHash) {
        if (!providedHash) {
            console.log('\x1b[107m\x1b[30m=== Current Hashes ===');
            console.log(`Trusted Hash: ${this.bot.trustedHash}`);
            console.log(`Owner Hash: ${this.bot.ownerHash}\x1b[0m`);
            return;
        }

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
            () => this.bot.chat('/prefix &8[&2&l\\\\&ahelp&8]', this.prefix),
            () => this.bot.chat('/username &7&lETA&7b�t'),
            () => this.bot.chat('/skin ETAGamer'),
            () => this.bot.chat('/vanish on'),
            () => this.bot.chat('/cspy on'),
            () => this.bot.chat('/god on')
        ];

        commands.forEach((cmd, index) => {
            setTimeout(cmd, index * 100);
        });

        filtering = !filtering;
    }

    handleMessage(message, username) {
        if (username === this.bot.username) return;
        if (message.startsWith('Command set:') || message.startsWith('ETAbot ')) return;

        console.log(`<${username}> ${message}`);

        const usedPrefix = this.prefixes.find(p => message.startsWith(p));
        if (!usedPrefix) return;

        const [command, ...args] = message.slice(usedPrefix.length).split(' ');
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
            if (!this.bot) return;

            if (input.startsWith('\\\\')) {
                let commandInput = input.slice(2).trim();
                let spaceIndex = commandInput.indexOf(' ');
                let cmd = spaceIndex === -1 ? commandInput : commandInput.slice(0, spaceIndex);
                let argsString = spaceIndex === -1 ? '' : commandInput.slice(spaceIndex + 1);
                let args;

                const commandHandler = this.commands.get(cmd);
                if (!commandHandler) return;

                // Commands that expect a hash
                const hashCommands = {
                    eval: 0,
                    bash: 0,
                    kill: 0,
                    crash: 1,
                    crashall: 0,
                    lagserver: 0
                };

                if (hashCommands[cmd] !== undefined) {
                    let hashIndex = hashCommands[cmd];

                    // Split args only if needed
                    if (cmd === 'bash' || cmd === 'eval') {
                        // Keep the whole command as one string after hash
                        args = [];
                        args[hashIndex] = this.bot.ownerHash; // inject hash
                        args.push(argsString); // everything else as single argument
                    } else {
                        // For normal commands, split by space
                        args = argsString.split(' ');
                        if (!args[hashIndex] || (args[hashIndex] !== this.bot.ownerHash && args[hashIndex] !== this.bot.trustedHash)) {
                            args[hashIndex] = this.bot.ownerHash;
                        }
                    }
                } else {
                    // Commands without hash
                    args = argsString.split(' ');
                }

                commandHandler(args);
            } else if (input.startsWith('/')) {
                this.bot.core.run(input);
            } else if (input.startsWith('c:')) {
                this.bot.chat(input.slice(2).trim());
            } else {
                this.bot.core.run(`/bcraw &8[&2ETAbot Core&8]&7: &a${input}`);
            }
        });
    }
}

new MinecraftBot();
// By etagamer
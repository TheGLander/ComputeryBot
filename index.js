const Discord = require(`discord.js`);
const config = require('./config.json')
const path = require(`path`)
const glob = require(`glob`)
var log4js = require('log4js');
var logger = log4js.getLogger();
var client = new Discord.Client()
// Adding logger.
function log(tolog) {
    if (config.debug) {
        logger.log(tolog);
        console.log(tolog)
        // Problem with log4js
    }
}

function error(errorreason) {
    // Show errors
    logger.error(errorreason);
}
const basePath = "./commands/"
const commands = glob.sync(path.join(basePath, '*.js')).reduce(function (loaded, file) {
    var mod = require(`./` + file);
    if (mod instanceof Object) {
        loaded[file.split(`/`)[file.split(`/`).length - 1].replace(/.js/, ``)] = {};
        Object.keys(mod).forEach(function (property) {
            loaded[file.split(`/`)[file.split(`/`).length - 1].replace(/.js/, ``)][property] = mod[property];
        });
    } else {
        loaded[file.split(`/`)[file.split(`/`).length - 1].replace(/.js/, ``)] = {
            "run": mod,
            "desc": {
                "name": file.split(`/`)[file.split(`/`).length - 1].replace(/.js/, ``),
                "desc": "No description provided.",
                "ignore": false
            }
        };
    }

    return loaded;
}, {});
client.login(config.token)
client.on(`ready`, async () => {
    const activities_list = [
        `Version ${config.version}`,
        `Watching ${client.guilds.size}`
    ];
    log(`${client.user.username} is online on ${client.guilds.size} servers.`);
    client.user.setActivity(`Version ${config.version}`)
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setActivity(activities_list[index]);
    }, 10000);
})
client.on(`guildCreate`, guild => {
    log(`[+] ${guild.name} (id: ${guild.id}). ${guild.memberCount} members.`);
});

client.on(`guildDelete`, guild => {
    log(`[-] ${guild.name} (id: ${guild.id})`);
});
client.on("message", (msg) => {
    log(`${!msg.guild?"DM": msg.guild.name} ${msg.author.tag} : ${msg.content}`);
    if (msg.author.bot || msg.channel.type === `dm`) return;
    let args = msg.content.split(` `);
    var curPrefix = (() => {
        for (var i in config.prefixAlias) {
            if (msg.content.startsWith(config.prefixAlias[i])) {
                return config.prefixAlias[i]
            }
        }
        return null;
    })()
    if (curPrefix) {
        //Command maybe
        log(`Executing oncall`);
        commands["oncall"].run(client, msg, args, config, commands)
        let command = commands[args[0].substr(curPrefix.length)]
        if (command && !(["default", "oncall", "unknown"].includes(args[0].substr(curPrefix.length)))) {
            //Command exists
            log(`Executing ${args[0].substr(curPrefix.length)}`);
            command.run(client, msg, args, config, commands)
        } else {
            //Unknown command
            log(`Executing unknown`);
            commands["unknown"].run(client, msg, args, config, commands)
        }
    } else {
        //Normal actions
        log(`Executing default`);
        commands["default"].run(client, msg, args, config, commands)
    }
})
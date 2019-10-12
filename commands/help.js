module.exports.run = async function (client, msg, args, config, commands) {
    //Will need reworking so it will grab the description from the commands.
    const botembed = {
        "title": "Command list",
        "description": "",
        "footer": {
            "icon_url": client.user.displayAvatarURL,
            "text": `G lander | 2019 © | Version ${config.version}`
        },
        "fields": (() => {
            var fields = [];
            for (var i in commands) {
                if (!commands[i].desc.ignore) {
                    fields.push({
                        "name": commands[i].desc.name,
                        "value": commands[i].desc.desc
                    })
                }
            }
            return fields
        })()
    };
    msg.channel.sendEmbed(botembed); //How do you use channel.send() with embeds?
}
module.exports.desc = {
    "name": "Help",
    "desc": "Shows this message. ",
    "ignore": false
}
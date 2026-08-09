const fs = require('fs');
const path = require('path');

// 1. Fix backend/server.js to prevent undefined substring crash
const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

const oldChannelNameLine = "const channelName = `ticket-${username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-${listingId.substring(0, 10)}`;";
const newChannelNameLine = "const channelName = `ticket-${username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-${(listingId || 'account').substring(0, 10)}`;";

if (serverContent.includes(oldChannelNameLine)) {
  serverContent = serverContent.replace(oldChannelNameLine, newChannelNameLine);
  console.log("Successfully fixed backend server channelName line!");
} else {
  console.log("WARNING: server channelName line match failed!");
}
fs.writeFileSync(serverPath, serverContent, 'utf8');

// 2. Fix app.js to use listing.id || listing._id
const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

const oldCreateTicketBody = `      id: ticketId,
      listingId: listing.id,
      listingTitle: listing.title,`;

const newCreateTicketBody = `      id: ticketId,
      listingId: listing.id || listing._id || 'unknown',
      listingTitle: listing.title,`;

if (appContent.includes(oldCreateTicketBody)) {
  appContent = appContent.replace(oldCreateTicketBody, newCreateTicketBody);
  console.log("Successfully fixed app.js POST body listingId!");
} else {
  console.log("WARNING: app.js POST body match failed!");
}

const oldNewTicketBody = `    listingId: listing.id,
    listingTitle: listing.title,`;

const newNewTicketBody = `    listingId: listing.id || listing._id || 'unknown',
    listingTitle: listing.title,`;

if (appContent.includes(oldNewTicketBody)) {
  appContent = appContent.replace(oldNewTicketBody, newNewTicketBody);
  console.log("Successfully fixed app.js ticket object listingId!");
} else {
  console.log("WARNING: app.js ticket object match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');

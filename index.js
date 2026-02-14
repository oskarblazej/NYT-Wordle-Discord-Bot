require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

if (!DISCORD_TOKEN || !CHANNEL_ID) {
    console.error("Error: Missing DISCORD_TOKEN or CHANNEL_ID in .env file");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

async function getTodayWordle() {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://www.nytimes.com/svc/wordle/v2/${today}.json`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`NYT API error: ${res.status}`);
        const data = await res.json();
        return data.solution;
    } catch (err) {
        console.error("Wordle fetch error:", err.message);
        return null;
    }
}

async function getDefinition(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return "No definition found for this word.";
        const data = await res.json();
        return data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";
    } catch (err) {
        return "Definition service currently unavailable.";
    }
}

async function postWordleSolution() {
    try {
        const word = await getTodayWordle();
        if (!word) return;

        const definition = await getDefinition(word);
        const channel = await client.channels.fetch(CHANNEL_ID);

        if (!channel) {
            console.error("Channel not found. Check bot permissions.");
            return;
        }

        const message = `🧩 **NYT Wordle Solution**\n||**${word.toUpperCase()}** – ${definition}||`;
        await channel.send(message);
        console.log(`[${new Date().toLocaleString()}] Solution posted: ${word}`);
    } catch (err) {
        console.error("Critical posting error:", err.message);
    }
}

client.once('clientReady', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    
    cron.schedule('0 14 * * *', () => {
        postWordleSolution();
    });
    
    console.log("Bot is ready. Schedule set for 14:00 server time.");
});

client.login(DISCORD_TOKEN);

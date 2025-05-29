// 🚀 Starter Slack Bot for Generating Outreach Messages

const { App } = require('@slack/bolt');
require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Slash command handler
app.command('/generate-intro', async ({ command, ack, client }) => {
    await ack();

    await client.views.open({
        trigger_id: command.trigger_id,
        view: {
            type: 'modal',
            callback_id: 'generate_intro_modal',
            title: { type: 'plain_text', text: 'Generate Intro Message' },
            submit: { type: 'plain_text', text: 'Generate' },
            close: { type: 'plain_text', text: 'Cancel' },
            blocks: [
                { type: 'input', block_id: 'network_line', element: { type: 'plain_text_input', action_id: 'input' }, label: { type: 'plain_text', text: 'Network Line (• Name (Title) at Company - Contact: Contact Name)' }},
                { type: 'input', block_id: 'fellow_name', element: { type: 'plain_text_input', action_id: 'input' }, label: { type: 'plain_text', text: 'Fellow Name' }},
                { type: 'input', block_id: 'fellow_linkedin', element: { type: 'plain_text_input', action_id: 'input' }, label: { type: 'plain_text', text: 'Fellow LinkedIn URL' }},
                { type: 'input', block_id: 'job_title', element: { type: 'plain_text_input', action_id: 'input' }, label: { type: 'plain_text', text: 'Job Title Applied' }},
                { type: 'input', block_id: 'company_applied', element: { type: 'plain_text_input', action_id: 'input' }, label: { type: 'plain_text', text: 'Company Applied' }}
            ]
        }
    });
});

// Modal submission handler
app.view('generate_intro_modal', async ({ ack, body, view, client }) => {
    await ack();

    const networkLine = view.state.values.network_line.input.value;
    const fellowName = view.state.values.fellow_name.input.value;
    const fellowLinkedIn = view.state.values.fellow_linkedin.input.value;
    const jobTitle = view.state.values.job_title.input.value;
    const companyApplied = view.state.values.company_applied.input.value;

    const connectionMatch = networkLine.match(/• (.*?) \((.*?)\) at (.*?) - Contact: (.*)/);
    if (!connectionMatch) {
        await client.chat.postMessage({
            channel: body.user.id,
            text: "❗ Invalid input format. Please use: • Name (Title) at Company - Contact: Contact Name"
        });
        return;
    }

    const connectionName = connectionMatch[1].trim();
    const connectionTitle = connectionMatch[2].trim();
    const contactName = connectionMatch[4].trim();

    const message = `Hi ${contactName},\n` +
        `I hope you're doing well. ${fellowName} has applied for the ${jobTitle} role at ${companyApplied} ` +
        `and is looking to connect with ${connectionName} (${connectionTitle}). Since you're connected with ${connectionName}, ` +
        `it would be greatly appreciated if you could introduce them.\n\nThank you!`;

    await client.chat.postMessage({
        channel: body.user.id,
        text: message
    });
});

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Slack bot is running!');
})();

const { get, post } = require('axios');
const express = require('express');
const { GITHUB_USER, GITHUB_TOKEN, OUTPUT_PATH, SECRET, WEBHOOK_URL, PORT, URL } = require('./config.json');
const bodyParser = require('body-parser');
const fs = require('fs');
const { execSync } = require('child_process');

// Check if all the required fields are present
if (!GITHUB_USER || !GITHUB_TOKEN || !OUTPUT_PATH || !SECRET || !WEBHOOK_URL || !PORT || !URL) {
    console.error('Please fill all the required fields in the config.json file');
    process.exit(1);
}
const app = express(
    {
        crossOriginIsolated: false,

    }
);

app.use(bodyParser.json());



const AuthenticateSecret = (req, res, next) => {
    // validate the webhook secret
    const { headers: { 'x-hub-signature': signature } } = req;
    const secret = SECRET;
    const { body } = req;
    const payload = JSON.stringify(body);
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha1', secret)
        .update(payload)
        .digest('hex');

    const digest = `sha1=${hash}`;
    console.log(digest);

    if (signature !== digest) {
        return res.status(401).send('Unauthorized');
    }
    next();
}

app.post('/webhook', AuthenticateSecret, async (req, res) => {
    const { body } = req;

    // Clone the repository to the server
    const { repository: { name, full_name, clone_url } } = body;
    const repoPath = `./${full_name}`;
    const github_token = GITHUB_TOKEN
    const gitHubUser = GITHUB_USER

    // Respond to Github
    res.sendStatus(200);

    // Check if the repo exists
    if (fs.existsSync(repoPath)) {
        execSync(`rm -rf ${repoPath}`);
    }


    const clone_time = new Date().getTime();
    execSync(`git clone https://${gitHubUser}:${github_token}@github.com/${full_name}.git ${repoPath}`);
    const clone_time_end = new Date().getTime();
    console.log(`Cloning Time: ${clone_time_end - clone_time}ms`);








    // Install dependencies
    console.log('Installing Dependencies');
    const install_time = new Date().getTime();
    execSync(`cd ${repoPath} && npm install`);
    const install_time_end = new Date().getTime();
    console.log(`Install Time: ${install_time_end - install_time}ms`);

    // Build the react app
    console.log('Building the React App');
    const build_time = new Date().getTime();
    execSync(`cd ${repoPath} && npm run build`);
    const build_time_end = new Date().getTime();
    console.log(`Build Time: ${build_time_end - build_time}ms`);
    console.log('Built the React App');

    // Copy the build to the server
    console.log('Copying the build to the server');
    const copy_time = new Date().getTime();
    execSync(`cp -r ${repoPath}/build/* ${OUTPUT_PATH}`);
    const copy_time_end = new Date().getTime();

    console.log(`Copied the build to ${OUTPUT_PATH} in ${copy_time_end - copy_time}ms`);


    // Send a Embed Message to Discord
    const webhook_url = WEBHOOK_URL;

    const embed = {
        title: 'Deployed Successfully',
        description: `Deployed the ${name} repository successfully\nTime Taken to Clone: ${clone_time_end - clone_time}ms\nTime Taken to Install Dependencies: ${install_time_end - install_time}ms\nTime Taken to Build: ${build_time_end - build_time}ms\nTime Taken to Copy: ${copy_time_end - copy_time}ms`,
        color: 0x00ff00,
        timestamp: new Date(),
        footer: {
            text: 'React Deployer',
            icon_url: URL + '/logo'
        }
    }

    const data = {
        embeds: [embed]
    }

    await post(webhook_url, data);



})

app.get('/logo', (req, res) => {
    res.sendFile(__dirname + '/logo.png');
})

app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ${PORT || 3000}`);
})
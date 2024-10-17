# React Auto-Deployer

A Node.js application that automatically deploys React applications upon receiving push events from GitHub. This tool clones your repository, installs dependencies, builds the React app, and moves the build to a specified output directory. It also sends a deployment notification to a Discord channel via a webhook.

## Features

- **Automated Deployment**: Deploy React applications automatically on each push to your GitHub repository.
- **GitHub Webhook Integration**: Listens to push events from GitHub via webhooks.
- **Secure Webhook Authentication**: Validates incoming webhook requests using a secret token.
- **Discord Notifications**: Sends deployment status and timing details to a Discord channel.
- **Customizable Output**: Specify the output path where the built application should be placed.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (version 14 or higher recommended).
- **npm**: Node Package Manager, usually comes with Node.js.
- **Git**: Required for cloning repositories.
- **A GitHub Account**: Access to the repository you wish to deploy.
- **A Discord Server**: For receiving deployment notifications (optional).
- **Server with Public Access**: The application must be accessible over the internet to receive GitHub webhooks.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Cyphersoftware-uk/react-github-deployer.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd react-github-deployer
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

## Configuration

Create and configure the `config.json` file in the root directory of the project.

```json
{
  "GITHUB_USER": "your_github_username",
  "GITHUB_TOKEN": "your_github_token",
  "WEBHOOK_URL": "your_discord_webhook_url",
  "PORT": 3000,
  "URL": "https://yourdomain.com",
  "OUTPUT_PATH": "/var/www/site/build",
  "SECRET": "your_webhook_secret"
}
```

### Configuration Parameters

- **GITHUB_USER**: Your GitHub username.
- **GITHUB_TOKEN**: A GitHub Personal Access Token with permissions to access your repositories.
- **WEBHOOK_URL**: Discord webhook URL to send deployment notifications.
- **PORT**: The port on which the application will run (default is `3000`).
- **URL**: The base URL where your application is hosted.
- **OUTPUT_PATH**: The directory where the built React application will be deployed.
- **SECRET**: A secret token for validating incoming GitHub webhooks.

### Generating a GitHub Personal Access Token

1. Go to your GitHub [Settings](https://github.com/settings/profile).
2. Navigate to **Developer settings** > **Personal access tokens** > **Fine-grained tokens**.
3. Click **Generate new token**.
4. Set a name and expiration date.
5. Under **Repository access**, select **Only select repositories** and choose your repository.
6. Under **Permissions**, grant **Contents** read and write access.
7. Click **Generate token** and copy the token into your `config.json`.

## Setting Up the GitHub Webhook

1. **Navigate to Your Repository**:

   Go to the GitHub repository you want to deploy.

2. **Go to Webhooks Settings**:

   Click on **Settings** > **Webhooks** > **Add webhook**.

3. **Configure the Webhook**:

   - **Payload URL**: `http://yourserver.com/webhook` (Replace with your server's address and ensure `/webhook` is appended).
   - **Content type**: `application/json`.
   - **Secret**: Use the same secret you set in `config.json` (`SECRET`).
   - **Which events would you like to trigger this webhook?**: Choose **Just the push event**.
   - **Active**: Ensure this is checked.

4. **Save**:

   Click **Add webhook** to save your settings.

## Running the Application

Start the server by running:

```bash
node index.js
```

You should see:

```
Server is running on port 3000
```

## Testing the Setup

1. **Push a Commit**:

   Make a commit to your repository and push it to GitHub.

2. **Monitor the Server Logs**:

   The server should log the deployment steps, including cloning, installing dependencies, building, and copying the build.

3. **Check the Output Directory**:

   The built React application should now be in your specified `OUTPUT_PATH`.

4. **Verify Discord Notification**:

   A deployment notification should appear in your Discord channel.

## Security Considerations

- **Protect Your `config.json`**: Ensure this file is not exposed publicly as it contains sensitive information.
- **Use HTTPS**: For production environments, ensure your server uses HTTPS to secure webhook communications.
- **Firewall Settings**: Open only the necessary ports (e.g., `PORT`) and secure others.

## Troubleshooting

- **Webhook Failing**:

  - Check that your server is publicly accessible.
  - Ensure the secret in GitHub matches the one in your `config.json`.
  - Verify that your server is running and listening on the correct port.

- **Permissions Errors**:

  - Ensure that the user running the Node.js application has write permissions to the `OUTPUT_PATH`.

- **Discord Notifications Not Appearing**:

  - Verify the `WEBHOOK_URL` is correct.
  - Check for any rate limits or restrictions in your Discord server.

## Customization

- **Modify Build Commands**:

  If your React application uses different scripts or build tools, adjust the commands in `index.js` accordingly.

- **Extend Notifications**:

  Customize the Discord embed message to include more details or adjust the formatting.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


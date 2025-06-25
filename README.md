# Clone the e2e repo and install Cypress

### Install and Verify Node.js and npm
* Install [Node.js](https://nodejs.org/en/download) verson 20 minimum
    * This should install npm automatically
* Open up Terminal or Git Bash
    * Verify the versions of both node and npm using the commands below
    * ```node -v```
    * ```npm -v```

### Install Visual Studio Code
* Install the latest [VS Code](https://code.visualstudio.com/download) 

### Create and add a new SSH key to GitHub
* [Check if you have an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys#checking-for-existing-ssh-keys) - Read and perform steps 1-3 of this "Checking for existing SSH keys" section to check if you have an existing SSH key on your machine
    * If you already have an SSH key with a Vicon Security repo, you can skip this entire step and move on to "Cloning the e2e repository and installing Cypress"
    * If you don't have a SSH key on your machine, go to the next step
* [Create a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key) - Read and perform steps 1-3 of this "Generating a new SSH key" section to create your new SSH key on your machine
* [Add your new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account#adding-a-new-ssh-key-to-your-account) - Read and perform steps 1-9 of this "Adding a new SSH key to your account" section to add your new SSH key to your GitHub account
* [Testing your SSH connection](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection) - Read and perform steps 1-3 of this "Testing your SSH connection" page to test your SSH connection

### Cloning the e2e repository and installing Cypress
* Create a new folder in your Documents directory
    * You can name it "GitHub", "GitHub Projects", "Cypress", etc.
* Open Terminal or Git Bash from the new folder you created
* Open the [e2e](https://github.com/vicon-security/e2e) GitHub page in your browser
* Click on the green Code button on the top right
    * Click on the SSH tab
    * Copy the url to your clipboard
* In Terminal or Git Bash:
    * ```git clone git@github.com:vicon-security/e2e.git```
    * This will clone the e2e repository
* Navigate to the e2e folder that was created in your new folder
    * In Terminal or Git Bash: ```cd e2e```
* Open the e2e directory in VS Code
    * In Terminal or Git Bash: ```code .```
* Open the Terminal in VS Code or use your existing Terminal or Git Bash
    * ```npm install```
    * This will install Cypress onto your machine

### Open Cypress
* In your Terminal or Git Bash
    * ```npx cypress open```

const { exec } = require("child_process");


const runCommand = (command, description) => {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${description}...`);
    const process = exec(command);


    process.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    process.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(`Command failed with exit code ${code}`);
      } else {
        console.log(`${description} completed successfully`);
        resolve();
      }
    });
  });
};


const deployApp = async () => {
  try {
    console.log("Starting deployment process...\n");

    try {
      await runCommand(
        "pm2 delete next-app-3001",
        "Deleting existing PM2 process next-app-3001"
      );
    } catch (err) {
      console.log(
        "No existing PM2 process found for next-app-3001. Skipping deletion."
      );
    }

    // await runCommand("npm install", "Installing project dependencies");

    await runCommand("npm run build", "Building the Next.js application");
    await runCommand(
      'pm2 start "npx next start -p 3001" --name next-app-3001',
      "Starting the app with PM2"
    );

    await runCommand("pm2 save", "Saving the PM2 process list");

    await runCommand("pm2 ls", "Displaying the PM2 process list");

    console.log("\nDeployment completed successfully!");
  } catch (error) {
    console.error("\nDeployment failed with the following error(s):");
    console.error(error);
    process.exit(1); 
  }
};

deployApp();

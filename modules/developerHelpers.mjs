import SuperLogger from "./SuperLogger.mjs";
import chalk from "chalk";

export default function printDeveloperStartupInportantInformationMSG() {

    drawLine("#", 20);

    SuperLogger.log(`Server enviorment ${process.env.ENVIORMENT}`, SuperLogger.LOGGING_LEVELS.CRTICAL);

    if (process.env.ENVIORMENT == "local") {
        SuperLogger.log(`Database connection  ${process.env.DB_CONNECTIONSTRING_LOCAL}`, SuperLogger.LOGGING_LEVELS.CRTICAL);
    } else {
        SuperLogger.log(`Database connection  ${process.env.DB_CONNECTIONSTRING_LOCAL}`, SuperLogger.LOGGING_LEVELS.CRTICAL);
    }

    if (process.argv.length > 2) {
        if (process.argv[2] == "--setup") {
            SuperLogger.log(chalk.red("Runing setup for database"), SuperLogger.LOGGING_LEVELS.CRTICAL);
            // TODO: Code that would set up our database with tbls etc..
        }
    }

    drawLine("#", 20);

}

function drawLine(symbole, length) {
    SuperLogger.log(symbole.repeat(length), SuperLogger.LOGGING_LEVELS.CRTICAL);
}
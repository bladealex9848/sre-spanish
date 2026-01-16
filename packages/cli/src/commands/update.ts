/**
 * Update Command - Oclif Implementation
 * Check for and install updates
 */

import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';
import { spawn } from 'child_process';
import { version } from '../../package.json';
import ora from 'ora';
import inquirer from 'inquirer';
import { getPackageManager } from '../utils/getPackageManager.js';

export default class Update extends Command {
    static override description = 'Check for and install updates';

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --check',
        '<%= config.bin %> <%= command.id %> --force',
    ];

    static override flags = {
        help: Flags.help({ char: 'h' }),
        check: Flags.boolean({
            description: 'Only check for updates without installing',
            char: 'c',
        }),
        force: Flags.boolean({
            description: 'Force update check and installation',
            char: 'f',
        }),
        package: Flags.string({
            description: 'Specify package manager (npm, pnpm, yarn)',
            char: 'p',
            options: ['npm', 'pnpm', 'yarn'],
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Update);
        const packageManager = flags.package || getPackageManager();

        this.log(chalk.blue('🔄 SmythOS CLI Update Manager'));
        this.log('');

        // Create update notifier instance
        const notifier = updateNotifier({
            pkg: { name: '@smythos/cli', version },
            updateCheckInterval: 0, // Always check for updates
        });

        const spinner = ora('Checking for updates...').start();

        try {
            // Check for updates
            const update = await notifier.fetchInfo();
            spinner.stop();

            if (update.latest !== update.current) {
                const { latest, current, type } = update;

                this.log(chalk.green('✅ Update Available!'));
                this.log('');
                this.log(chalk.gray(`Current version: ${chalk.yellow(current)}`));
                this.log(chalk.gray(`Latest version:  ${chalk.green(latest)}`));
                this.log(chalk.gray(`Update type:     ${chalk.cyan(type)}`));
                this.log('');

                if (flags.check) {
                    this.log(chalk.blue('📋 Check complete. Use without --check to install.'));
                    this.showManualInstructions(packageManager);
                } else {
                    const { confirm } = await inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'confirm',
                            message: 'Do you want to install this update now?',
                            default: true,
                        },
                    ]);

                    if (confirm) {
                        await this.performUpdate(packageManager, latest);
                    } else {
                        this.log('');
                        this.log(chalk.yellow('Update cancelled by user.'));
                        this.showManualInstructions(packageManager);
                    }
                }
            } else {
                this.log(chalk.green('✅ You are using the latest version!'));
                this.log(chalk.gray(`Current version: ${chalk.yellow(version)}`));

                if (flags.force) {
                    this.log('');
                    this.log(chalk.yellow('💡 Force flag was used, but no updates are available.'));
                }
            }
        } catch (error) {
            spinner.stop();
            this.log(chalk.red('❌ Error checking for updates:'));
            this.log(chalk.gray(error.message));
            this.log('');
            this.showManualInstructions(packageManager);
        }
    }

    private async forceUpdateCheck(notifier: any): Promise<void> {
        // This method is no longer needed with the new approach
        // but we'll keep it to avoid breaking changes if it's used elsewhere.
    }

    private async performUpdate(packageManager: string, latestVersion: string): Promise<void> {
        this.log(chalk.blue('🚀 Installing update...'));
        this.log('');

        const updateSpinner = ora(`Installing @smythos/cli@${latestVersion} with ${packageManager}...`).start();

        try {
            const command = this.getUpdateCommand(packageManager);
            await this.runCommand(command.cmd, command.args);

            updateSpinner.succeed(chalk.green('✅ Update installed successfully!'));
            this.log('');
            this.log(chalk.blue('🎉 SmythOS CLI has been updated!'));
            this.log(chalk.gray(`You can now use the latest features and improvements.`));
            this.log('');
            this.log(chalk.yellow('💡 Run your command again to use the updated version.'));
        } catch (error) {
            updateSpinner.fail(chalk.red('❌ Update failed'));
            this.log('');
            this.log(chalk.red('Error during installation:'));
            this.log(chalk.gray(error.message));
            this.log('');
            this.showManualInstructions(packageManager);
        }
    }

    private getUpdateCommand(packageManager: string): { cmd: string; args: string[] } {
        switch (packageManager) {
            case 'npm':
                return { cmd: 'npm', args: ['install', '-g', '@smythos/cli@latest'] };
            case 'yarn':
                return { cmd: 'yarn', args: ['global', 'add', '@smythos/cli@latest'] };
            case 'pnpm':
            default:
                return { cmd: 'pnpm', args: ['install', '-g', '@smythos/cli@latest'] };
        }
    }

    private runCommand(command: string, args: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                stdio: 'inherit',
                shell: true,
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Command failed with exit code ${code}`));
                }
            });

            child.on('error', reject);
        });
    }

    private showManualInstructions(packageManager: string): void {
        this.log(chalk.blue('📖 Manual update instructions:'));
        this.log('');

        switch (packageManager) {
            case 'npm':
                this.log(chalk.cyan('  npm install -g @smythos/cli@latest'));
                break;
            case 'yarn':
                this.log(chalk.cyan('  yarn global add @smythos/cli@latest'));
                break;
            case 'pnpm':
            default:
                this.log(chalk.cyan('  pnpm install -g @smythos/cli@latest'));
                break;
        }

        this.log('');
        this.log(chalk.gray('Or try with a different package manager:'));
        this.log(chalk.gray(`  sre update --package npm`));
        this.log(chalk.gray(`  sre update --package yarn`));
        this.log(chalk.gray(`  sre update --package pnpm`));
    }
}

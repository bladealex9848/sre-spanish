/**
 * SRE CLI Tool - Package Manager Detection
 *
 * This utility helps in identifying the package manager (npm, pnpm, or yarn)
 * used to install the SRE CLI. This is crucial for providing the correct
 * update instructions to the user.
 */

/**
 * Detects the package manager used to run the CLI.
 *
 * It checks the path of the executed script. If the package is installed
 * globally via pnpm, its path will contain '.pnpm'. This is a reliable
 * way to detect pnpm.
 *
 * For yarn, it checks the `npm_config_user_agent` environment variable,
 * which is a standard way to detect yarn.
 *
 * If neither pnpm nor yarn is detected, it defaults to npm.
 *
 * @returns {'npm' | 'pnpm' | 'yarn'} The detected package manager.
 */
export const getPackageManager = (): 'npm' | 'pnpm' | 'yarn' => {
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent) {
        if (userAgent.startsWith('pnpm')) {
            return 'pnpm';
        }
        if (userAgent.startsWith('yarn')) {
            return 'yarn';
        }
        if (userAgent.startsWith('npm')) {
            return 'npm';
        }
    }

    // Fallback for global installs where user-agent is not set.
    // process.argv[1] is the path to the executed script.
    const scriptPath = process.argv[1] || '';
    if (scriptPath.includes('.pnpm')) {
        return 'pnpm';
    }

    // A simple check for yarn's global install path
    if (scriptPath.includes('yarn')) {
        return 'yarn';
    }

    return 'npm'; // Default to npm
};

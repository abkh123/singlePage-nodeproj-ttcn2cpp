import { execSync } from 'child_process';

export async function processText(input) {
    try {
        console.log('Input Given:', input);
        // Remove all CR and LF from the input
        const cleanedInput = input.replace(/[\r\n]+/g, ' ').trim();
                
        // Escape double quotes in the input
        const escapedInput = cleanedInput.replace(/"/g, '\\"');

        // Execute ttcn_parser.exe with the cleaned input as a command-line argument
        const command = `ttcn_parser.exe "${escapedInput}"`;
        const output = execSync(command, { encoding: 'utf8' });

        console.log('ttcn_parser.exe output:', output);
        
        // Return the output directly
        return output;
    } catch (error) {
        console.error('Error executing ttcn_parser.exe:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            path: error.path,
        });
        throw error; // Re-throw the error to be caught by the route handler
    }
}
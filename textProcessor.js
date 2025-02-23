import fs from 'fs';
import { execSync } from 'child_process';
import { setTimeout } from 'timers/promises';

export async function processText(input) {
    try {
        // Step 1: Extract the module name from the input
        const moduleNameMatch = input.match(/module\s+(\w+)\s*\{/);
        if (!moduleNameMatch) {
            console.error('Invalid input: Module name not found.');
            return 'Error: Module name not found in the input.'; // User-friendly error
        }
        const moduleName = moduleNameMatch[1];
        const outputCppFile = `${moduleName}.cpp`;

        console.log('Module name:', moduleName);
        console.log('Output .cpp file:', outputCppFile);

        // Step 2: Write the input text to a file called sample.ttcn
        fs.writeFileSync('sample.ttcn', input);
        console.log('sample.ttcn file created successfully.');

        // Step 3: Call the executable ttcn_parser.exe with sample.ttcn as an argument
        let parserOutput;
        try {
            parserOutput = execSync('ttcn_parser.exe sample.ttcn', { encoding: 'utf8' });
            console.log('ttcn_parser.exe output:', parserOutput);
        } catch (execError) {
            // Capture the error output from the executable
            const errorOutput = execError.stderr?.toString() || execError.stdout?.toString() || execError.message;
            console.error('Error executing ttcn_parser.exe:', errorOutput);

            // Check if the error contains "Parse error!"
            if (errorOutput.includes('Parse error!')) {
                return `Parser Error: ${errorOutput}`; // User-friendly error message
            } else {
                return `Error: Failed to execute ttcn_parser.exe. Details: ${errorOutput}`;
            }
        }

        // Add a small delay to ensure the file is created
        await setTimeout(1000);

        // Step 4: Read the content of the generated .cpp file
        let cppContent;
        try {
            cppContent = fs.readFileSync(outputCppFile, 'utf8');
            console.log('Successfully read .cpp file:', outputCppFile);
        } catch (readError) {
            console.error(`Error reading ${outputCppFile}:`, {
                message: readError.message,
                stack: readError.stack,
                code: readError.code,
                path: readError.path,
            });
            return `Error: Failed to read the generated .cpp file. Details: ${readError.message}`;
        }

        // Step 5: Return the content of the generated .cpp file
        return cppContent; // Ensure this is a string
    } catch (error) {
        console.error('Unexpected error in processText:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            path: error.path,
        });
        return `Error: An unexpected error occurred. Details: ${error.message}`;
    }
}
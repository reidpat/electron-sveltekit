import json from '@rollup/plugin-json';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export async function compileSvelteComponent(inputPath, outputPath) {
    console.log('Starting Svelte component compilation');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Input path:', inputPath);
    console.log('Output path:', outputPath);

    try {
        await fs.access(inputPath);
        console.log('Input file exists');
    } catch (error) {
        console.error('Input file does not exist:', error);
        return error;
    }

    const inputOptions = {
        input: inputPath,
        plugins: [
            json(),
            svelte({
                compilerOptions: {
                    dev: process.env.NODE_ENV !== 'production',
                    css: 'injected'
                },
                emitCss: false
            }),
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs()
        ]
    };

    const outputOptions = {
        format: 'es',
        file: outputPath,
        name: 'CompiledComponent'
    };

    let bundle;
    try {
        bundle = await rollup(inputOptions);
        console.log('Bundle created successfully');
        
        const { output } = await bundle.generate(outputOptions);
        console.log('Output generated successfully');

        await fs.writeFile(outputPath, output[0].code);
        console.log('Successfully wrote compiled JS to', outputPath);

        console.log('Svelte component compiled successfully');
        return output[0].code;
    } catch (error) {
        console.error('Error during compilation process:', error);
        return error;
    } finally {
        if (bundle) {
            await bundle.close();
            console.log('Bundle closed');
        }
    }
}

// If you want to run this script directly (not just as an imported function)
if (import.meta.url === `file://${process.argv[1]}`) {
    const inputPath = "C:/Coding/frames-electron-sveltekit/src/assets/test.svelte";
    const outputPath = "C:/Coding/frames-electron-sveltekit/src/assets/test.js";
    compileSvelteComponent(inputPath, outputPath)
        .then((result) => {
            if (result === "success") {
                console.log("Compilation completed successfully");
            } else {
                console.error("Compilation failed:", result);
            }
        })
        .catch((error) => {
            console.error("Unexpected error:", error);
        });
}
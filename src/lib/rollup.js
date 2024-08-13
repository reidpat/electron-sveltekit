import json from '@rollup/plugin-json';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);

let basePath = path.join(__dirname, '/assets');

export async function compileSvelteComponent() {
    const inputOptions = {
        input: "C:/Coding/frames-electron-sveltekit/src/assets/test.svelte",
        plugins: [
            json(),
            svelte({
                compilerOptions: {
                    dev: true,
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
        file: "C:/Coding/frames-electron-sveltekit/src/assets/test.js",
        sourcemap: true,
    };

    try {
        const bundle = await rollup(inputOptions);
        console.log('bundle', bundle);
        
        // Write the bundle to disk
        await bundle.write(outputOptions);
        
        // Close the bundle
        await bundle.close();

        console.log('Svelte component compiled successfully');
    } catch (error) {
        console.error('Error compiling Svelte component:', error);
        throw error;
    }
}
import {compileSvelteComponent} from "$lib/rollup";

export async function GET(){
    const inputPath = "C:/frames/test.svelte";
    const outputPath = "C:/frames/test.js";
    let response = await compileSvelteComponent(inputPath, outputPath);
    // console.log('Response:', response);

    return new Response(response);
}
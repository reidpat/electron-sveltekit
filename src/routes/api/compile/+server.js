import {compileSvelteComponent} from "$lib/rollup";

export async function GET(){
    let response;
    try {
        
        const inputPath = "C:/frames/test.svelte";
        const outputPath = "C:/frames/test.js";
        response = await compileSvelteComponent(inputPath, outputPath);
    } catch (error) {
        return new Response(error);
    }
   
    // console.log('Response:', response);

    return new Response(response);
}

export async function POST({request}){
    let response;
    let json = await request.json();
    try {
        
        // const inputPath = "C:/frames/test.svelte";
        // const outputPath = "C:/frames/test.js";
        response = await compileSvelteComponent(json.inputPath, json.outputPath);
    } catch (error) {
        return new Response(error);
    }
   
    // console.log('Response:', response);

    return new Response(response);
}
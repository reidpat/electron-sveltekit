import {compileSvelteComponent} from "$lib/rollup";

export function GET(){
    compileSvelteComponent();

    return new Response('Success');
}
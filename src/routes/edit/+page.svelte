<script>
    import { onMount } from "svelte";
    import grapesjs from "grapesjs";
    import "grapesjs/dist/css/grapes.min.css";

    let editorContainer;
    let editor;

    onMount(() => {
        editor = grapesjs.init({
            container: editorContainer,
            height: "100%",
            width: "auto",
            deviceManager: { devices: [] },
            storageManager: { type: null },
            dragMode: "absolute",
            blockManager: {
                appendTo: "#blocks",
                blocks: [
                    {
                        id: "section",
                        label: "<b>Section</b>",
                        attributes: { class: "gjs-block-section" },
                        content: `<section>
                <h1>This is a simple title</h1>
                <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
              </section>`,
                    },
                    {
                        id: "text",
                        label: "Text",
                        content:
                            '<div data-gjs-type="text">Insert your text here</div>',
                    },
                    {
                        id: "image",
                        label: "Image",
                        select: true,
                        content: { type: "image" },
                        activate: true,
                    },
                ],
            },
        });

        editor.getConfig().showDevices = false;
        // Make all components draggable by default
        editor.on("component:create", (component) => {
            component.set("draggable", true);
            component.set("resizable", true);
            if (!component.get("style").position) {
                component.setStyle({ position: "absolute" });
            }
        });

        // Ensure draggability when loading saved content
        editor.on("load", () => {
            editor.DomComponents.getWrapper()
                .findDescendants()
                .forEach((component) => {
                    component.set("draggable", true);
                    component.set("resizable", true);
                    if (!component.get("style").position) {
                        component.setStyle({ position: "absolute" });
                    }
                });
        });
        // panelManager.removePanel(devices);
    });
</script>

<div class="panel__top">
    <div class="panel__basic-actions"></div>
</div>
<div class="editor-row">
    <div id="blocks"></div>
    <div id="editor" bind:this={editorContainer}></div>
</div>

<style>
    .editor-row {
        display: flex;
        height: 100vh;
    }

    #blocks {
        width: 200px;
        overflow-y: auto;
    }

    #editor {
        flex: 1;
    }
</style>

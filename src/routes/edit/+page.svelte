<script>
    import { onMount } from "svelte";
    import grapesjs from "grapesjs";
    import "grapesjs/dist/css/grapes.min.css";
    import basic from "grapesjs-blocks-basic";

    let editorContainer;
    let editor;

    let fileContent;

    async function loadSvelteFile(path) {
        let svelteContent = { script: "", style: "", html: "", imports: [] };
        let content = await window.electronAPI.readLocalFile(path);

        const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);

        let html = content;

        // Remove script tag and its content
        if (scriptMatch) {
            html = html.replace(scriptMatch[0], "");
            svelteContent.script = scriptMatch[1].trim();

            // Extract imports
            const importRegex =
                /import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
            let match;
            while ((match = importRegex.exec(svelteContent.script)) !== null) {
                svelteContent.imports.push({
                    statement: match[0],
                    path: match[1],
                });
            }
        }

        // Remove style tag and its content
        if (styleMatch) {
            html = html.replace(styleMatch[0], "");
            svelteContent.style = styleMatch[1].trim();
        }

        // Trim any leading or trailing whitespace
        svelteContent.html = html.trim();
        svelteContent.path = path;

        return svelteContent;
    }

    function registerSvelteComponent(editor, name, content) {
        editor.DomComponents.addType(name, {
            model: {
                defaults: {
                    tagName: name,
                    components: content,
                    attributes: { "data-gjs-type": name },
                    traits: [], // Add traits here if you want editable props
                },
            },
            view: {
                onRender({ el, model }) {
                    el.innerHTML = model
                        .get("components")
                        .map((c) => c.toHTML())
                        .join("");
                },
            },
        });

        editor.BlockManager.add(name, {
            label: name,
            content: { type: name },
        });
    }

    onMount(async () => {
        fileContent = await loadSvelteFile(
            `C:/frames/frames/Frames Logo.svelte`,
        );

        let importedComponents = [];

        for (const importItem of fileContent.imports) {
            const componentName =
                importItem.statement.match(/import\s+(\w+)/)[1];
            const componentContent = await loadSvelteFile(importItem.path);

            importedComponents.push({
                ...componentContent,
                name: componentName,
            });
            // registerSvelteComponent(
            //     editor,
            //     componentName,
            //     componentContent.html,
            // );
        }

        function mergeSvelteComponents(mainComponent, importedComponents) {
            let mergedHTML = mainComponent.html;

            console.log(importedComponents);

            // Function to replace component tags with their HTML content
            function replaceComponentTags(html) {
                const componentRegex =
                    /<([A-Z][a-zA-Z]*)([^>]*)>([\s\S]*?)<\/\1>/g;

                return html.replace(
                    componentRegex,
                    (match, componentName, attributes, content) => {
                        const importStatement = mainComponent.imports.find(
                            (imp) =>
                                imp.statement.includes(
                                    `import ${componentName}`,
                                ),
                        );

                        console.log(importStatement);

                        if (importStatement) {
                            const importedComponent = importedComponents.find(
                                (comp) => {
                                    console.log(comp);
                                    return comp.path === importStatement.path;
                                },
                            );

                            console.log(importedComponent);

                            if (importedComponent) {
                                // Replace slot with content
                                let componentHTML =
                                    importedComponent.html.replace(
                                        "<slot />",
                                        content,
                                    );

                                // Add attributes
                                const openingTag =
                                    componentHTML.match(/<[^>]+>/)[0];
                                const newOpeningTag =
                                    openingTag.slice(0, -1) +
                                    " " +
                                    attributes.trim() +
                                    ">";
                                componentHTML = componentHTML.replace(
                                    openingTag,
                                    newOpeningTag,
                                );

                                // Recursively replace nested components
                                return replaceComponentTags(componentHTML);
                            }
                        }
                        return match; // If no replacement found, return original match
                    },
                );
            }

            mergedHTML = replaceComponentTags(mergedHTML);

            return {
                html: mergedHTML,
                script: mainComponent.script,
                style:
                    mainComponent.style +
                    "\n" +
                    importedComponents.map((comp) => comp.style).join("\n"),
            };
        }

        const mergedComponent = mergeSvelteComponents(
            fileContent,
            importedComponents,
        );
        console.log(mergedComponent);


        editor = grapesjs.init({
            container: editorContainer,
            height: "100%",
            width: "auto",
            deviceManager: { devices: [] },
            storageManager: { type: null },
            dragMode: "translate",
            plugins: [basic],
            pluginsOpts: {
                "gjs-blocks-basic": {
                    /* ...options */
                },
            },
            blocks: ["text", "image", "heading", "paragraph"],
            components: mergedComponent.html,
            blockManager: {
                appendTo: "#blocks",
                blocks: [
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

        // Register imported components

        editor.getConfig().showDevices = false;
        // Make all components draggable by default
        editor.on("component:create", (component) => {
            component.set("draggable", true);
            component.set("resizable", true);
            component.setStyle({ position: "relative" })
            // if (!component.get("style").position) {
            //     ;
            // }
        });

        // Ensure draggability when loading saved content
        // editor.on("load", () => {
        //     console.log(editor.DomComponents);
        //     editor.DomComponents
        //         // .forEach((component) => {
        //         //     component.set("draggable", true);
        //         //     component.set("resizable", true);
        //         //     if (!component.get("style").position) {
        //         //         component.setStyle({ position: "absolute" });
        //         //     }
        //         // });
        // });
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

import "svelte/internal/disclose-version";
import * as $ from "svelte/internal/client";

var root = $.template(`<div class="prose"><h1 class="text-primary">Folder Testing</h1> <p>Additional Edits - Testing Again</p> <p>Some more tests</p> <p>So now I can edit this however much I want right?</p></div>`);

export default function Component($$anchor) {
	var div = root();
	var h1 = $.child(div);
	var p = $.sibling($.sibling(h1, true));
	var p_1 = $.sibling($.sibling(p, true));
	var p_2 = $.sibling($.sibling(p_1, true));

	$.append($$anchor, div);
}
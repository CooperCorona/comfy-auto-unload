import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";
import { $el } from "../../scripts/ui.js";

app.registerExtension({
    name: "Comfy.AutoUnload",
    init() {
        $el("style", {
            parent: document.head,
        });
    },
    async setup() {
        function showForm() {
            console.log("showing form");
        }
        const menu = document.querySelector(".comfy-menu");
        const separator = document.createElement("hr");

        separator.style.margin = "20px 0";
        separator.style.width = "100%";
        menu.append(separator);

		const showFormButton = document.createElement("button");
		showFormButton.textContent = "Autounload";
		showFormButton.onclick = () => showForm();
		menu.append(showFormButton);
    }
});
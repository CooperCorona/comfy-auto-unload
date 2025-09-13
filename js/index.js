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
            // Create modal overlay
            const modal = document.createElement("div");
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;

            // Create modal content
            const modalContent = document.createElement("div");
            modalContent.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 8px;
                width: 300px;
                position: relative;
            `;

            // Close button
            const closeButton = document.createElement("button");
            closeButton.textContent = "×";
            closeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                background: none;
                border: none;
                cursor: pointer;
            `;
            closeButton.onclick = () => document.body.removeChild(modal);

            // Form
            const form = document.createElement("form");
            form.style.cssText = "display: flex; flex-direction: column; gap: 10px;";

            const textBox = document.createElement("input");
            textBox.type = "text";
            textBox.placeholder = "Seconds to unload";
            textBox.style.cssText = "padding: 8px; border: 1px solid #ccc; border-radius: 4px;";

            const submitButton = document.createElement("button");
            submitButton.type = "submit";
            submitButton.textContent = "Submit";
            submitButton.style.cssText = "padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;";

            // Add event listener to form
            form.onsubmit = async (e) => {
                e.preventDefault();
                try {
                    const response = await api.fetchApi("/unload_time_remaining", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ "time_remaining": textBox.value })
                    });

                    if (response.ok) {
                        document.body.removeChild(modal);
                    } else {
                        throw new Error("Failed to set unload time");
                    }
                } catch (error) {
                    alert("Error setting unload time: " + error.message);
                }
            };

            // Build modal structure
            form.appendChild(textBox);
            form.appendChild(submitButton);
            modalContent.appendChild(closeButton);
            modalContent.appendChild(form);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        }
        const menu = document.querySelector(".comfyui-menu");
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
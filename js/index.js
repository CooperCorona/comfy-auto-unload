import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";
app.registerExtension({
    name: "Comfy.AutoUnload",
    commands: [
        {
            id: "setUnload5Minutes",
            label: "5 Minutes",
            function: async () => {
                try {
                    const response = await api.fetchApi("/unload_time_remaining", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ "time_remaining": 300 })
                    });
                    if (!response.ok) {
                        throw new Error("Failed to set unload time");
                    }
                } catch (error) {
                    alert("Error setting unload time: " + error.message);
                }
            }
        },
        {
            id: "setUnload10Minutes",
            label: "10 Minutes",
            function: async () => {
                try {
                    const response = await api.fetchApi("/unload_time_remaining", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ "time_remaining": 600 })
                    });
                    if (!response.ok) {
                        throw new Error("Failed to set unload time");
                    }
                } catch (error) {
                    alert("Error setting unload time: " + error.message);
                }
            }
        },
        {
            id: "setUnload30Minutes",
            label: "30 Minutes",
            function: async () => {
                try {
                    const response = await api.fetchApi("/unload_time_remaining", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ "time_remaining": 1800 })
                    });
                    if (!response.ok) {
                        throw new Error("Failed to set unload time");
                    }
                } catch (error) {
                    alert("Error setting unload time: " + error.message);
                }
            }
        }
    ],
    menuCommands: [
        {
            path: ["Extensions", "AutoUnload"],
            commands: ["setUnload5Minutes", "setUnload10Minutes", "setUnload30Minutes"]
        }
    ]
});

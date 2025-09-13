# my_extension/__init__.py
from server import PromptServer
import aiohttp
from datetime import datetime
import asyncio
import os
import sys


DEFAULT_UNLOAD_DELAY_SECONDS = 300


class UnloadTimeTracker:
    def __init__(self):
        self.timestamp = None
        self.timer_handle = None
        self.unload_delay_seconds = DEFAULT_UNLOAD_DELAY_SECONDS
        PromptServer.instance.add_on_prompt_handler(self.on_prompt_executed)
        PromptServer.instance.routes.get("/unload_time_remaining")(
            self.unload_time_remaining
        )
        PromptServer.instance.routes.post("/unload_time_remaining")(
            self.set_unload_time_remaining
        )

    @property
    def time_remaining(self):
        if self.timestamp is None:
            elapsed_seconds = 0
            time_remaining = self.unload_delay_seconds
        else:
            elapsed_seconds = int((datetime.now() - self.timestamp).total_seconds())
            time_remaining = max(0, self.unload_delay_seconds - elapsed_seconds)
        return time_remaining

    async def unload_time_remaining(self, request):
        return aiohttp.web.json_response({"time_remaining": self.time_remaining})

    async def set_unload_time_remaining(self, request):
        try:
            data = await request.json()
            new_value = int(data.get("time_remaining", 0))
            if new_value < 0:
                return aiohttp.web.Response(status=400, text="Time remaining must be non-negative")
            self.unload_delay_seconds = new_value
            return aiohttp.web.json_response({"status": "success", "time_remaining": self.unload_delay_seconds})
        except (ValueError, TypeError):
            return aiohttp.web.Response(status=400, text="Invalid time_remaining value")

    def on_prompt_executed(self, json_data):
        self.timestamp = datetime.now()
        print("Received prompt:", json_data, "at timestamp:", self.timestamp)
        # Reset the timer when a new prompt is executed
        if self.timer_handle:
            self.timer_handle.cancel()
        self.start_timer()
        return json_data

    def start_timer(self):
        async def check_and_free():
            while True:
                await asyncio.sleep(1)  # Check every second
                if self.time_remaining <= 0:
                    self.free()
                    break

        self.timer_handle = asyncio.create_task(check_and_free())

    def free(self):
        request = aiohttp.web.Request(
            headers={},
            payload=None,
            app=PromptServer.instance.app,
            path="/free",
            method="POST"
        )
        request.json = lambda: {"unload_models": True, "free_memory": True}
        PromptServer.instance.post_free(request)
        
tracker = UnloadTimeTracker()

ext_dir = os.path.dirname(__file__)
sys.path.append(ext_dir)
WEB_DIRECTORY = "js"

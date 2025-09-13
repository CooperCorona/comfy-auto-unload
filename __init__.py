# my_extension/__init__.py
from server import PromptServer
import aiohttp
from datetime import datetime


UNLOAD_DELAY_SECONDS = 300


class UnloadTimeTracker:
    def __init__(self):
        self.timestamp = None
        PromptServer.instance.add_on_prompt_handler(self.on_prompt_executed)
        PromptServer.instance.routes.get("/unload_time_remaining")(
            self.unload_time_remaining
        )

    async def unload_time_remaining(self, request):
        if self.timestamp is None:
            time_remaining = UNLOAD_DELAY_SECONDS
        else:
            elapsed_seconds = int((datetime.now() - self.timestamp).total_seconds())
            time_remaining = max(0, UNLOAD_DELAY_SECONDS - elapsed_seconds)
        return aiohttp.web.json_response({"time_remaining": time_remaining})

    def on_prompt_executed(self, json_data):
        self.timestamp = datetime.now()
        print("Received prompt:", json_data, "at timestamp:", self.timestamp)
        return json_data


tracker = UnloadTimeTracker()

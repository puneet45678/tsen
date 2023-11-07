from loguru import logger
import sys
import os
import httpx
import json
import asyncio
from datetime import datetime
from config import read_yaml

directory = "logs"
if not os.path.exists(directory):
    os.makedirs(directory)

class SumoLogicHandler:
    def __init__(self, url, batch_size=100):
        self.url = url
        self.client = httpx.AsyncClient()
        self.batch_size = batch_size
        self.batch = []

    async def write(self, message):
        message = str(message)
        log_parts = message.split("|")

        if len(log_parts) != 6:
            return

        log = {
            "timestamp": log_parts[0].strip(),
            "level": log_parts[1].strip(),
            "name": log_parts[2].strip(),
            "function": log_parts[3].strip(),
            "file_line": log_parts[4].strip(),
            "message": log_parts[5].strip(),
        }

        self.batch.append(json.dumps(log))  # convert the log to a JSON string

        if len(self.batch) >= self.batch_size:
            await self.flush()

    async def flush(self):
        if self.batch:
            newline_separated_logs = "\n".join(self.batch)
            async with httpx.AsyncClient() as client:
                response = await client.post(self.url, data=newline_separated_logs)
                print(response.status_code)
            self.batch = []

        await self.client.aclose()


def get_logger(name):
    log_format = ("<blue>[{time:YYYY-MM-DD HH:mm:ss.SSS}]</blue> | <level>{level}</level> | <red>{name}</red> | <green>{function}</green> | <magenta>{file}:{line}</magenta> | <cyan>{message}</cyan>")

    log_file = os.path.join(directory, "cart_orders.log")
    url = "https://collectors.in.sumologic.com/receiver/v1/http/ZaVnC4dhaV2QA7-8rVYzlA3nF1ZcC8BMk8agDxi0TbkjQkfDC012fA_F0uZHd0j_pmRCHTam6vtx5qEK2KQseLAQmxTpkW_-_oarsREOKt5EEiAWqQR_DQ=="

    configg = {
        "handlers": [
            {
                "sink": sys.stdout,
                "format": log_format,
                "level": "DEBUG",
                "diagnose": False,
                "colorize": True, # Enable colorizing of console output
            },
            {
                "sink": log_file,
                "format": log_format,
                "level": "DEBUG",
                "diagnose": False,
                "rotation": "10 KB",
                "retention": 5
            },
            {
                "sink": SumoLogicHandler(url).write,
                "format": log_format,
                "level": "DEBUG",
                "serialize": False,
            },
        ],
    }

    # Define custom colors
    logger.level("DEBUG", color="<yellow>")
    logger.level("INFO", color="<green>")
    logger.level("ERROR", color="<red>")

    logger.configure(**configg)

    return logger


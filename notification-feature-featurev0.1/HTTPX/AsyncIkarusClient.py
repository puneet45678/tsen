import httpx


class AsyncIkarusClient:
    def __init__(self, request_id: str = None):
        self.request_id = request_id

    def _set_request_id(self, request_id):
        self.request_id = request_id

    async def _request(self, method: str, url: str, **kwargs):
        headers = kwargs.get("headers", {})
        if self.request_id:
            headers["X-ikarus-nest-request-id"] = self.request_id
        kwargs["headers"] = headers

        async with httpx.AsyncClient() as client:
            response = await client.request(method, url, **kwargs)
        return response

    async def get(self, url: str, **kwargs):
        return await self._request("GET", url, **kwargs)

    async def post(self, url: str, json=None, **kwargs):
        return await self._request("POST", url, json=json, **kwargs)

    async def put(self, url: str, json=None, **kwargs):
        return await self._request("PUT", url, json=json, **kwargs)

    async def delete(self, url: str, **kwargs):
        return await self._request("DELETE", url, **kwargs)

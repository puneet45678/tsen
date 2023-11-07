import httpx

class SyncIkarusClient:
    def __init__(self, request_id: str = None):
        self.request_id = request_id
    
    def _request(self, method: str, url: str, **kwargs):
        headers = kwargs.get("headers", {})
        if self.request_id:
            headers["X-ikarus-nest-request-id"] = self.request_id
        kwargs["headers"] = headers

        with httpx.Client() as client:
            response = client.request(method,url,**kwargs)
        return response
        

    def get(self, url: str, **kwargs):
        return self._request("GET", url, **kwargs)

    def post(self, url: str, json=None, **kwargs):
        return self._request("POST", url, json=json, **kwargs)

    def put(self, url: str, json=None, **kwargs):
        return self._request("PUT", url, json=json, **kwargs)

    def delete(self, url: str, **kwargs):
        return self._request("DELETE", url, **kwargs)


"""
Cloud Service Client for securely accessing external cloud service APIs.

This module provides a secure HTTP client with:
- Bearer token authentication
- Proper error and timeout handling
- Retry logic for transient failures
- Structured logging
"""
import logging
import time
from typing import Dict, Any, Optional
import requests
from requests.exceptions import RequestException, Timeout, ConnectionError

from config import config

logger = logging.getLogger(__name__)


class CloudServiceError(Exception):
    """Base exception for cloud service errors."""
    pass


class CloudServiceAuthenticationError(CloudServiceError):
    """Raised when authentication fails (401/403)."""
    pass


class CloudServiceTimeoutError(CloudServiceError):
    """Raised when request times out."""
    pass


class CloudServiceConnectionError(CloudServiceError):
    """Raised when connection fails."""
    pass


class CloudServiceClient:
    """
    HTTP client for accessing external cloud service APIs.
    
    Features:
    - Bearer token authentication
    - Configurable timeouts and retries
    - Proper error handling and logging
    """
    
    def __init__(
        self,
        base_url: Optional[str] = None,
        token: Optional[str] = None,
        timeout: Optional[int] = None,
        max_retries: Optional[int] = None
    ):
        """
        Initialize the cloud service client.
        
        Args:
            base_url: Base URL for the cloud service (defaults to config.AWS_URL)
            token: API token (defaults to config.AWS_TOKEN)
            timeout: Request timeout in seconds (defaults to config.HTTP_TIMEOUT)
            max_retries: Maximum retry attempts (defaults to config.HTTP_MAX_RETRIES)
        """
        self.base_url = (base_url or config.AWS_URL).rstrip('/')
        self.token = token or config.AWS_TOKEN
        self.timeout = timeout if timeout is not None else config.HTTP_TIMEOUT
        self.max_retries = max_retries if max_retries is not None else config.HTTP_MAX_RETRIES
        
        if not self.base_url or not self.token:
            raise CloudServiceError(
                "AWS_URL and AWS_TOKEN must be configured. "
                "Set them as environment variables or in .env file."
            )
        
        logger.info(
            f"CloudServiceClient initialized for {self.base_url} "
            f"(timeout={self.timeout}s, retries={self.max_retries})"
        )
    
    def _get_headers(self) -> Dict[str, str]:
        """Get HTTP headers including authorization."""
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    def _handle_response(self, response: requests.Response) -> Dict[str, Any]:
        """
        Handle HTTP response and extract data.
        
        Args:
            response: HTTP response object
            
        Returns:
            Parsed JSON response data
            
        Raises:
            CloudServiceAuthenticationError: For 401/403 errors
            CloudServiceError: For other errors
        """
        logger.debug(f"Response status: {response.status_code}")
        
        # Handle authentication errors
        if response.status_code == 401:
            logger.error(
                "Authentication failed (401 Unauthorized). "
                "Check if the API token is valid and not expired."
            )
            raise CloudServiceAuthenticationError(
                "Invalid or expired authentication token"
            )
        
        if response.status_code == 403:
            logger.error(
                "Access forbidden (403 Forbidden). "
                "Check if the API token has sufficient permissions."
            )
            raise CloudServiceAuthenticationError(
                "Insufficient permissions or access denied"
            )
        
        # Handle other client errors
        if 400 <= response.status_code < 500:
            error_detail = f"Client error {response.status_code}"
            try:
                error_data = response.json()
                error_detail = error_data.get('detail', error_data.get('message', error_detail))
            except Exception:
                error_detail = response.text[:200] if response.text else error_detail
            
            logger.error(f"Client error: {error_detail}")
            raise CloudServiceError(f"Client error: {error_detail}")
        
        # Handle server errors
        if response.status_code >= 500:
            logger.error(f"Server error {response.status_code}: {response.text[:200]}")
            raise CloudServiceError(f"Server error: {response.status_code}")
        
        # Success - parse JSON response
        try:
            return response.json()
        except ValueError as e:
            logger.error(f"Failed to parse JSON response: {str(e)}")
            raise CloudServiceError("Invalid JSON response from cloud service")
    
    def get(
        self,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Make a GET request to the cloud service.
        
        Args:
            path: API endpoint path (e.g., '/artists')
            params: Query parameters
            **kwargs: Additional arguments to pass to requests
            
        Returns:
            Parsed JSON response
            
        Raises:
            CloudServiceError: For various error conditions
            CloudServiceTimeoutError: If request times out
            CloudServiceConnectionError: If connection fails
        """
        # Ensure path starts with /
        if not path.startswith('/'):
            path = '/' + path
        
        url = f"{self.base_url}{path}"
        headers = self._get_headers()
        
        logger.info(f"Making GET request to {url}")
        
        # Retry logic
        last_exception = None
        for attempt in range(self.max_retries + 1):
            try:
                response = requests.get(
                    url,
                    headers=headers,
                    params=params,
                    timeout=self.timeout,
                    **kwargs
                )
                return self._handle_response(response)
                
            except Timeout as e:
                last_exception = CloudServiceTimeoutError(
                    f"Request to {url} timed out after {self.timeout} seconds"
                )
                logger.warning(
                    f"Request timeout (attempt {attempt + 1}/{self.max_retries + 1}): {str(e)}"
                )
                if attempt < self.max_retries:
                    time.sleep(1)  # Brief delay before retry
                    continue
                    
            except ConnectionError as e:
                last_exception = CloudServiceConnectionError(
                    f"Failed to connect to {url}: {str(e)}"
                )
                logger.warning(
                    f"Connection error (attempt {attempt + 1}/{self.max_retries + 1}): {str(e)}"
                )
                if attempt < self.max_retries:
                    time.sleep(1)  # Brief delay before retry
                    continue
                    
            except CloudServiceAuthenticationError:
                # Don't retry authentication errors
                raise
                
            except RequestException as e:
                last_exception = CloudServiceError(f"Request failed: {str(e)}")
                logger.error(
                    f"Request error (attempt {attempt + 1}/{self.max_retries + 1}): {str(e)}",
                    exc_info=True
                )
                if attempt < self.max_retries:
                    time.sleep(1)  # Brief delay before retry
                    continue
        
        # All retries exhausted
        if last_exception:
            logger.error(f"All retry attempts exhausted: {str(last_exception)}")
            raise last_exception
        raise CloudServiceError("Failed to complete request after all retries")
    
    def post(
        self,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Make a POST request to the cloud service.
        
        Args:
            path: API endpoint path
            data: Request body data
            **kwargs: Additional arguments to pass to requests
            
        Returns:
            Parsed JSON response
        """
        # Ensure path starts with /
        if not path.startswith('/'):
            path = '/' + path
            
        url = f"{self.base_url}{path}"
        headers = self._get_headers()
        
        logger.info(f"Making POST request to {url}")
        
        try:
            response = requests.post(
                url,
                headers=headers,
                json=data,
                timeout=self.timeout,
                **kwargs
            )
            return self._handle_response(response)
        except Timeout as e:
            raise CloudServiceTimeoutError(
                f"Request to {url} timed out after {self.timeout} seconds"
            )
        except ConnectionError as e:
            raise CloudServiceConnectionError(
                f"Failed to connect to {url}: {str(e)}"
            )
        except RequestException as e:
            logger.error(f"POST request failed: {str(e)}", exc_info=True)
            raise CloudServiceError(f"POST request failed: {str(e)}")


def create_cloud_service_client() -> CloudServiceClient:
    """Create and return a configured CloudServiceClient instance."""
    return CloudServiceClient()





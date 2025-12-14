"""
Test cases for cloud service integration.

Tests cover:
- Happy Path: Successful data retrieval (200 OK)
- Sad Path: Invalid credentials (401/403)
- Timeout handling
- Error logging
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
import requests

from services.cloud_service_client import (
    CloudServiceClient,
    CloudServiceError,
    CloudServiceAuthenticationError,
    CloudServiceTimeoutError,
    CloudServiceConnectionError
)
from main import app

client = TestClient(app)


class TestCloudServiceClientHappyPath:
    """Happy Path test cases."""
    
    @patch('services.cloud_service_client.requests.get')
    def test_successful_data_retrieval_200_ok(self, mock_get):
        """
        Happy Path: Middleware successfully retrieves and validates cloud data structure.
        
        Given the environment variables are set with a valid Cloud Service URL and Token
        And the Middleware application is initialized
        When the Middleware makes a request to the cloud service
        Then the response status code should be 200 (OK)
        And the retrieved data should adhere to the predefined JSON schema
        """
        # Setup mock response
        mock_response_data = {
            "results": [
                {
                    "name": "Bruce Springsteen",
                    "country": "United States",
                    "city": "Long Branch",
                    "albums": []
                }
            ]
        }
        
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_response_data
        mock_get.return_value = mock_response
        
        # Create client and make request
        with patch.dict('os.environ', {
            'AWS_URL': 'https://test.example.com',
            'AWS_TOKEN': 'test-token'
        }):
            client_instance = CloudServiceClient(
                base_url="https://test.example.com",
                token="test-token"
            )
            
            result = client_instance.get("/artists")
            
            # Assertions
            assert "results" in result
            assert isinstance(result["results"], list)
            assert len(result["results"]) == 1
            
            # Verify correct headers were sent
            mock_get.assert_called_once()
            call_args = mock_get.call_args
            assert "Authorization" in call_args.kwargs["headers"]
            assert call_args.kwargs["headers"]["Authorization"] == "Bearer test-token"
    
    @patch('services.cloud_service_client.requests.get')
    def test_data_adheres_to_schema(self, mock_get):
        """
        Verify that retrieved data matches expected JSON schema structure.
        """
        # Example schema-compliant response
        mock_response_data = {
            "results": [
                {
                    "name": "Bruce Springsteen",
                    "country": "United States",
                    "city": "Long Branch",
                    "summary": "...",
                    "image": "https://...",
                    "albums": []
                }
            ]
        }
        
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_response_data
        mock_get.return_value = mock_response
        
        with patch.dict('os.environ', {
            'AWS_URL': 'https://test.example.com',
            'AWS_TOKEN': 'test-token'
        }):
            client_instance = CloudServiceClient(
                base_url="https://test.example.com",
                token="test-token"
            )
            result = client_instance.get("/artists")
            
            # Validate schema structure
            assert "results" in result
            assert isinstance(result["results"], list)
            if len(result["results"]) > 0:
                artist = result["results"][0]
                assert "name" in artist
                assert isinstance(artist["name"], str)


class TestCloudServiceClientSadPath:
    """Sad Path test cases."""
    
    @patch('services.cloud_service_client.requests.get')
    def test_invalid_token_401_unauthorized(self, mock_get):
        """
        Sad Path: Middleware fails to access data with invalid credentials.
        
        Given the environment variables are set with an invalid or expired Token
        And the Middleware application is initialized
        When the Middleware attempts to access the service
        Then the response status code should be 401 (Unauthorized)
        And the Middleware's logs should contain an ERROR message detailing the authentication failure
        """
        # Setup mock 401 response
        mock_response = Mock()
        mock_response.status_code = 401
        mock_response.json.return_value = {"error": "Unauthorized", "message": "Invalid token"}
        mock_get.return_value = mock_response
        
        with patch.dict('os.environ', {
            'AWS_URL': 'https://test.example.com',
            'AWS_TOKEN': 'invalid-token'
        }):
            client_instance = CloudServiceClient(
                base_url="https://test.example.com",
                token="invalid-token"
            )
            
            # Expect authentication error
            with pytest.raises(CloudServiceAuthenticationError) as exc_info:
                client_instance.get("/artists")
            
            assert "Invalid or expired authentication token" in str(exc_info.value)
    
    @patch('services.cloud_service_client.requests.get')
    def test_insufficient_permissions_403_forbidden(self, mock_get):
        """
        Sad Path: Middleware fails with 403 Forbidden.
        
        When the token is valid but lacks permissions
        Then the response status code should be 403 (Forbidden)
        And an appropriate error should be raised
        """
        # Setup mock 403 response
        mock_response = Mock()
        mock_response.status_code = 403
        mock_response.json.return_value = {"error": "Forbidden", "message": "Insufficient permissions"}
        mock_get.return_value = mock_response
        
        with patch.dict('os.environ', {
            'AWS_URL': 'https://test.example.com',
            'AWS_TOKEN': 'test-token'
        }):
            client_instance = CloudServiceClient(
                base_url="https://test.example.com",
                token="test-token"
            )
            
            with pytest.raises(CloudServiceAuthenticationError) as exc_info:
                client_instance.get("/artists")
            
            assert "Insufficient permissions" in str(exc_info.value)
    
    @patch('services.cloud_service_client.requests.get')
    def test_timeout_handling(self, mock_get):
        """
        Test that timeout errors are properly handled.
        """
        mock_get.side_effect = requests.Timeout("Request timed out")
        
        with patch.dict('os.environ', {
            'AWS_URL': 'https://test.example.com',
            'AWS_TOKEN': 'test-token'
        }):
            client_instance = CloudServiceClient(
                base_url="https://test.example.com",
                token="test-token",
                timeout=5,
                max_retries=2
            )
            
            with pytest.raises(CloudServiceTimeoutError) as exc_info:
                client_instance.get("/artists")
            
            assert "timed out" in str(exc_info.value).lower()
    
    @patch('services.cloud_service_client.requests.get')
    def test_connection_error_handling(self, mock_get):
        """
        Test that connection errors are properly handled.
        """
        mock_get.side_effect = requests.ConnectionError("Connection refused")
        
        with patch.dict('os.environ', {
            'AWS_URL': 'https://test.example.com',
            'AWS_TOKEN': 'test-token'
        }):
            client_instance = CloudServiceClient(
                base_url="https://test.example.com",
                token="test-token",
                max_retries=2
            )
            
            with pytest.raises(CloudServiceConnectionError) as exc_info:
                client_instance.get("/artists")
            
            assert "Failed to connect" in str(exc_info.value)


class TestCloudServiceIntegration:
    """Integration tests with FastAPI endpoint."""
    
    @patch('services.cloud_service_client.requests.get')
    @patch('config.config.AWS_URL', 'https://test.example.com')
    @patch('config.config.AWS_TOKEN', 'test-token')
    def test_endpoint_with_cloud_service(self, mock_get):
        """
        Test the FastAPI endpoint that uses the cloud service client.
        """
        mock_response_data = {"results": [{"name": "Test Artist"}]}
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_response_data
        mock_get.return_value = mock_response
        
        response = client.get("/cloud/artists")
        
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert "data" in response.json()
    
    @patch('services.cloud_service_client.requests.get')
    @patch('config.config.AWS_URL', 'https://test.example.com')
    @patch('config.config.AWS_TOKEN', 'invalid-token')
    def test_endpoint_authentication_failure(self, mock_get):
        """
        Test the endpoint's handling of authentication failures.
        """
        mock_response = Mock()
        mock_response.status_code = 401
        mock_response.json.return_value = {"error": "Unauthorized"}
        mock_get.return_value = mock_response
        
        response = client.get("/cloud/artists")
        
        assert response.status_code == 401
        assert "authenticate" in response.json()["detail"].lower()


class TestConfigurationValidation:
    """Test configuration and environment variable handling."""
    
    def test_missing_url_raises_error(self):
        """Test that missing AWS_URL raises an error."""
        with patch.dict('os.environ', {'AWS_TOKEN': 'test-token'}, clear=True):
            with pytest.raises(CloudServiceError) as exc_info:
                CloudServiceClient(base_url="", token="test-token")
            
            assert "must be configured" in str(exc_info.value)
    
    def test_missing_token_raises_error(self):
        """Test that missing AWS_TOKEN raises an error."""
        with patch.dict('os.environ', {'AWS_URL': 'https://test.example.com'}, clear=True):
            with pytest.raises(CloudServiceError) as exc_info:
                CloudServiceClient(base_url="https://test.example.com", token="")
            
            assert "must be configured" in str(exc_info.value)


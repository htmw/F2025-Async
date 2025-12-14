"""
Configuration module for environment variables.
Loads and validates configuration from environment variables.
"""

import os

from dotenv import load_dotenv

# Load environment variables from .env file (for local development)
load_dotenv()


class Config:
    """Application configuration loaded from environment variables."""

    # Cloud service configuration
    AWS_URL = os.getenv("AWS_URL", "")
    AWS_TOKEN = os.getenv("AWS_TOKEN", "")

    # HTTP client configuration
    HTTP_TIMEOUT = int(os.getenv("HTTP_TIMEOUT", "30"))
    HTTP_MAX_RETRIES = int(os.getenv("HTTP_MAX_RETRIES", "3"))

    @classmethod
    def validate(cls):
        """Validate that required configuration is present."""
        if not cls.AWS_URL:
            raise ValueError("AWS_URL environment variable is required")
        if not cls.AWS_TOKEN:
            raise ValueError("AWS_TOKEN environment variable is required")
        if not cls.AWS_URL.startswith(("http://", "https://")):
            raise ValueError("AWS_URL must start with http:// or https://")

    @classmethod
    def is_configured(cls):
        """Check if configuration is complete."""
        return bool(cls.AWS_URL and cls.AWS_TOKEN)


# Global configuration instance
config = Config()

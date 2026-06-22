from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

_client: Client | None = None

def get_supabase() -> Client | None:
    """
    Returns a configured Supabase client, or None if credentials are not set.
    Callers must handle the None case gracefully.
    """
    global _client
    if _client is not None:
        return _client

    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.warning("Supabase credentials not found. Using in-memory mock data.")
        return None

    try:
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return _client
    except Exception as e:
        logger.error(f"Failed to create Supabase client: {e}")
        return None

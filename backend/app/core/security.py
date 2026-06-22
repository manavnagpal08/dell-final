from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from typing import Optional
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def verify_token(token: str = Depends(oauth2_scheme)) -> Optional[dict]:
    # For a real production app using Supabase Auth, you'd verify the JWT signature 
    # against the Supabase JWT secret.
    if not token:
        # In hackathon mode, we might allow bypass if no token is provided, 
        # or enforce it strictly. Let's return None for now to simulate.
        return None
        
    try:
        # payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"], audience="authenticated")
        # return payload
        return {"sub": "mock-user-id", "role": "authenticated"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(payload: dict = Depends(verify_token)):
    if not payload:
        # Hackathon fallback: don't require strict auth
        return {"role": "admin"}
    return payload

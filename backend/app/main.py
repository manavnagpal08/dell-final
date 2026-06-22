from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
from app.core.config import settings
from app.api.routes import api_router
from app.api.websockets import router as ws_router
from app.core.logging import logger
from app.services.data_generator import run_data_generator
import asyncio

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for VyomAi - Predictive Maintenance & Digital Twin"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:9000",
    "https://vyom-ai-frontend.vercel.app", # Replace with actual frontend URL
    # Include Electron URL if running locally as desktop app
    "file://"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon, allow all. Restrict in prod.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"Method: {request.method} Path: {request.url.path} Status: {response.status_code} Duration: {process_time:.4f}s")
    return response

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(ws_router) # Mount websockets at root or API prefix

@app.on_event("startup")
async def startup_event():
    # Background data generator started
    asyncio.create_task(run_data_generator())

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory in the container
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies (needed for some ML libraries)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Expose the port the app runs on
EXPOSE 8000

# Run the FastAPI application using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

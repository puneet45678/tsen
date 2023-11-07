# Use a smaller base image
FROM python:3.9-slim-buster AS base

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Build stage: Here you'd typically compile or prepare your application
FROM base AS build
COPY . .

# Final runtime stage
FROM python:3.9-slim-buster
WORKDIR /app

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Create the logs directory as root
RUN mkdir -p /app/logs

# Change the ownership of the logs directory to appuser
RUN chown -R appuser:appuser /app/logs

# Now switch to appuser
USER appuser

# Copy built app and dependencies from previous stages
COPY --from=build /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=build /app /app

# Start the application
CMD ["python", "run.py"]

import json
import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

from main import app

def generate_spec():
    with open("api.json", "w") as f:
        json.dump(app.openapi(), f, indent=2)
    print("API Specification generated successfully in api.json")

if __name__ == "__main__":
    generate_spec()

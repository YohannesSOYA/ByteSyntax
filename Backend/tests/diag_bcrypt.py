import bcrypt
import time

print("Starting bcrypt test...")
password = "test_password".encode('utf-8')

start = time.time()
salt = bcrypt.gensalt(rounds=4) # Use low rounds for speed check first, then default
print(f"Low rounds Salt generated in {time.time() - start:.4f}s")

start = time.time()
hashed = bcrypt.hashpw(password, salt)
print(f"Low rounds Password hashed in {time.time() - start:.4f}s")

print("Testing default rounds (12)...")
start = time.time()
salt = bcrypt.gensalt() # Default rounds
print(f"Default Salt generated in {time.time() - start:.4f}s")

start = time.time()
hashed = bcrypt.hashpw(password, salt)
print(f"Default Password hashed in {time.time() - start:.4f}s")

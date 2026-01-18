from app import app
import json

def test_search():
    # Create a test client
    with app.test_client() as client:
        print("Testing Search with Phone Number '0123456789'...")
        
        # Simulate POST request
        response = client.post('/api/search', 
                             data=json.dumps({'phone_number': '0123456789', 'tracking_code': ''}),
                             content_type='application/json')
                             
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.get_json()}")

if __name__ == "__main__":
    test_search()

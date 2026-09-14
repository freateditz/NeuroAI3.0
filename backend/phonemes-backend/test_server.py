"""
Test script for phonemes backend
Run this to verify the server is working correctly
"""
import requests
import json

BASE_URL = "http://localhost:5002"

def test_health():
    """Test health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_letters():
    """Test letters endpoint"""
    print("\n=== Testing Letters Endpoint ===")
    try:
        response = requests.get(f"{BASE_URL}/letters")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_letter_test(letter="A"):
    """Test the /test/<letter> endpoint"""
    print(f"\n=== Testing /test/{letter} Endpoint ===")
    try:
        response = requests.get(f"{BASE_URL}/test/{letter}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_generate_word(letter="S"):
    """Test the /generate_word/<letter> endpoint"""
    print(f"\n=== Testing /generate_word/{letter} Endpoint ===")
    try:
        response = requests.get(f"{BASE_URL}/generate_word/{letter}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_remedy(percentage=30):
    """Test the remedy endpoint"""
    print(f"\n=== Testing /remedy/{percentage} Endpoint ===")
    try:
        response = requests.get(f"{BASE_URL}/remedy/{percentage}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print("=" * 50)
    print("Phonemes Backend Test Suite")
    print("=" * 50)
    print("\nMake sure the server is running on port 5002!")
    print("Run: python main.py")
    
    results = []
    
    # Run tests
    results.append(("Health Check", test_health()))
    results.append(("Letters List", test_letters()))
    results.append(("Test Letter A", test_letter_test("A")))
    results.append(("Test Letter S", test_letter_test("S")))
    results.append(("Generate Word", test_generate_word("F")))
    results.append(("Remedy (Low Score)", test_remedy(30)))
    results.append(("Remedy (High Score)", test_remedy(80)))
    
    # Print summary
    print("\n" + "=" * 50)
    print("Test Summary")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Server is working correctly.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the errors above.")

if __name__ == "__main__":
    main()

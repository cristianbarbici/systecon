import pytest
from fastapi.testclient import TestClient
from io import BytesIO
from main import app  # Adjust the import path since it's now in the same directory

client = TestClient(app)

def test_upload_csv():
    # Create a sample CSV file in memory with the expected structure
    csv_content = (
        "Name,Type,Quantity,Price ($),Failure rate (1/year),Description,Parent\n"
        "Widget A,Type1,100,10.99,0.02,Description A,Parent1\n"
        "Widget B,Type2,200,20.99,0.03,Description B,Parent2"
    )
    files = {"file": ("test.csv", BytesIO(csv_content.encode('utf-8')), "text/csv")}

    # Send a POST request to the /upload-csv/ endpoint
    response = client.post("/upload-csv/", files=files)

    # Assert the response status code and content
    assert response.status_code == 200
    assert response.json() == [
        {
            "Name": "Widget A",
            "Type": "Type1",
            "Quantity": 100,
            "Price ($)": 10.99,
            "Failure rate (1/year)": 0.02,
            "Description": "Description A",
            "Parent": "Parent1"
        },
        {
            "Name": "Widget B",
            "Type": "Type2",
            "Quantity": 200,
            "Price ($)": 20.99,
            "Failure rate (1/year)": 0.03,
            "Description": "Description B",
            "Parent": "Parent2"
        }
    ]

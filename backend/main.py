from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO
import chardet
import logging
from typing import List, Dict, Any

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing purposes
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

EXPECTED_COLUMNS = [
    "Name", "Type", "Quantity", "Price ($)", "Failure rate (1/year)", "Description", "Parent"
]

def process_csv(df: pd.DataFrame) -> Dict[str, Any]:
    """Process the DataFrame to separate product and parts."""
    # Convert data types
    df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce').fillna(0).astype(int)
    df['Price ($)'] = pd.to_numeric(df['Price ($)'].replace('[\$,]', '', regex=True), errors='coerce').fillna(0.0)
    df['Failure rate (1/year)'] = pd.to_numeric(df['Failure rate (1/year)'], errors='coerce').fillna(0.0).astype(float)

    # Separate product and parts
    product_df = df[df['Type'] == 'Product']
    if product_df.empty:
        raise HTTPException(status_code=400, detail="No product row found. Ensure there is a row with Type value 'Product'.")

    product_row = product_df.iloc[0]
    parts_df = df[df['Type'] == 'Product Breakdown']

    # Calculate costs for the product
    product_initial_cost = (parts_df['Quantity'] * parts_df['Price ($)']).sum()
    product_yearly_cost = (parts_df['Quantity'] * parts_df['Price ($)'] * parts_df['Failure rate (1/year)']).sum()

    # Build product and parts structure
    system = {
        "product": product_row['Description'],
        "acquisition": product_initial_cost,
        "annual": product_yearly_cost,
    }

    components = [
        {
            "part": row['Name'],
            "system": product_row['Description'],
            "quantity": row['Quantity'],
            "failureRate": row['Failure rate (1/year)'],
            "price": row['Price ($)'],
            "annual": row['Quantity'] * row['Price ($)'] * row['Failure rate (1/year)']
        }
        for _, row in parts_df.iterrows()
    ]

    return {"system": system, "components": components}

@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        result = chardet.detect(contents)
        encoding = result['encoding']
        df = pd.read_csv(StringIO(contents.decode(encoding)))

        if not all(column in df.columns for column in EXPECTED_COLUMNS):
            raise HTTPException(status_code=400, detail="CSV file does not have the expected structure.")

        df = df.where(pd.notnull(df), "")

        return process_csv(df)
    except pd.errors.ParserError:
        logging.error("Error parsing CSV file.")
        raise HTTPException(status_code=400, detail="Error parsing CSV file.")
    except HTTPException as e:
        logging.error(f"HTTP error: {str(e)}")
        raise e
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

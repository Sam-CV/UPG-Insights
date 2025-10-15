import pandas as pd
import openai
import os
import time
from typing import Optional

# Set your OpenAI API key
# You can set this as an environment variable: export OPENAI_API_KEY='your-key-here'
openai.api_key = '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'

def get_language_code(testimony: str) -> Optional[str]:
    """
    Uses OpenAI API to determine the language code from a testimony.
    
    Args:
        testimony: The testimony text to analyze
        
    Returns:
        Three-letter ISO language code or None if error
    """
    if pd.isna(testimony) or not testimony.strip():
        return None
    
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Using gpt-4o-mini (gpt5-nano doesn't exist)
            messages=[
                {
                    "role": "user",
                    "content": f"Please return only three letter ISO language code that reflects the dialect the main character in this story would speak:\n\n{testimony}"
                }
            ],
            temperature=0.3,  # Low temperature for consistent results
            max_tokens=10,    # We only need a 3-letter code
        )
        
        language_code = response.choices[0].message.content.strip().upper()
        
        # Validate it's a 3-letter code
        if len(language_code) == 3 and language_code.isalpha():
            return language_code
        else:
            print(f"Warning: Unexpected response format: {language_code}")
            return language_code[:3] if language_code else None
            
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None

def process_csv(input_file: str, output_file: str):
    """
    Process the CSV file and fill in empty language codes.
    
    Args:
        input_file: Path to input CSV file
        output_file: Path to output CSV file
    """
    # Read the CSV file
    print(f"Reading {input_file}...")
    df = pd.read_csv(input_file)
    
    # Display initial statistics
    total_rows = len(df)
    empty_language = df['Language'].isna() | (df['Language'] == '')
    empty_count = empty_language.sum()
    
    print(f"\nTotal rows: {total_rows}")
    print(f"Rows with empty Language: {empty_count}")
    print(f"Rows with Language filled: {total_rows - empty_count}")
    
    if empty_count == 0:
        print("\nAll language codes are already filled!")
        return
    
    # Process rows with empty language
    print(f"\nProcessing {empty_count} rows...")
    processed = 0
    errors = 0
    
    for idx, row in df.iterrows():
        if pd.isna(row['Language']) or row['Language'] == '':
            testimony = row['Testimony']
            print(f"\nProcessing row {idx + 1}/{total_rows} (Country: {row['Country']})", end='')
            
            language_code = get_language_code(testimony)
            
            if language_code:
                df.at[idx, 'Language'] = language_code
                processed += 1
                print(f" -> {language_code}")
            else:
                errors += 1
                print(" -> ERROR")
            
            # Add a small delay to avoid rate limiting
            time.sleep(0.5)
    
    # Save the updated CSV
    print(f"\nSaving to {output_file}...")
    df.to_csv(output_file, index=False)
    
    print(f"\n{'='*50}")
    print(f"Processing complete!")
    print(f"Successfully filled: {processed}")
    print(f"Errors: {errors}")
    print(f"Total processed: {processed + errors}")
    print(f"{'='*50}")

if __name__ == "__main__":
    input_file = "b.csv"
    output_file = "Social_Direct_Testimonies_Updated.csv"
    
    print("="*50)
    print("Language Code Filler Script")
    print("="*50)
    print("\nNOTE: This script uses 'gpt-4o-mini' model")
    print("(gpt5-nano does not exist in OpenAI's API)")
    print("\nMake sure to set your OPENAI_API_KEY environment variable")
    print("or edit the script to include your API key.")
    print("="*50)
    
    process_csv(input_file, output_file)
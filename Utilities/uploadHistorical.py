import re

def parse_data(content):
    # Split the content into lines
    lines = content.split('\n')
    
    # Extract headers (first line)
    headers = lines[0].split('\t')
    
    # Map headers to the target column names in the database
    column_mapping = {
        'Year': 'year',
        'Country': 'country',
        'What we tested': 'trying_to_test',
        'What we hoped to learn': 'hope_to_learn',
        'What we learnt': 'learnt'
    }
    
    # Map header indices
    column_indices = {}
    for index, header in enumerate(headers):
        target_column = column_mapping.get(header.strip())
        if target_column:
            column_indices[target_column] = index
    
    # Parse the data rows
    data = []
    for i in range(1, len(lines)):
        line = lines[i].strip()
        if line:
            values = line.split('\t')
            
            # Check if the line has enough columns
            if len(values) >= len(column_indices):
                row = {}
                for column, index in column_indices.items():
                    if index < len(values):
                        row[column] = values[index].strip() if values[index] else ''
                    else:
                        row[column] = ''
                
                # Fix Sri Lanka naming and skip 'nan' countries
                if row['country'] == 'SriLanka':
                    row['country'] = 'Sri Lanka'
                
                # Skip rows where country is 'nan'
                if row['country'] != 'nan':
                    data.append(row)
    
    return data

def generate_insert_statement(data):
    table_name = 'upg_historical_hypothesis_tests'
    columns = ['country', 'year', 'trying_to_test', 'hope_to_learn', 'learnt']
    
    sql = f"INSERT INTO {table_name} ({', '.join(columns)})\nVALUES\n"
    
    rows = []
    for row in data:
        values = []
        for column in columns:
            value = row.get(column, '')
            
            # Format as number for year column
            if column == 'year' and value.isdigit():
                values.append(value)
            else:
                # Escape single quotes in strings by doubling them (SQL standard)
                escaped_value = str(value).replace("'", "''")
                values.append(f"'{escaped_value}'")
        
        rows.append(f"({', '.join(values)})")
    
    sql += ',\n'.join(rows)
    sql += ';'
    
    return sql

def main():
    try:
        # Read the file content
        with open('paste.txt', 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Process the data
        data = parse_data(content)
        total_rows = len(data)
        
        # Generate SQL
        sql = generate_insert_statement(data)
        
        # Write to output file
        output_filename = 'redshift_inserts.sql'
        with open(output_filename, 'w', encoding='utf-8') as output_file:
            output_file.write(f"-- Total rows processed: {total_rows}\n")
            output_file.write(f"-- SriLanka changed to Sri Lanka and 'nan' countries skipped\n\n")
            output_file.write(sql)
        
        print(f"SQL successfully written to {output_filename}")
        print(f"Total rows processed: {total_rows}")
    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
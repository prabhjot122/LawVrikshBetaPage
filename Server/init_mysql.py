#!/usr/bin/env python3
"""
MySQL Database Initialization Script for LawVriksh Feedback System
This script reads the schema.sql file and executes it to create the database tables.
"""

import os
import sys
import pymysql
from dotenv import load_dotenv
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

def parse_database_url(database_url):
    """Parse DATABASE_URL into connection parameters"""
    if not database_url:
        return None
    
    # Handle mysql+pymysql:// URLs
    if database_url.startswith('mysql+pymysql://'):
        database_url = database_url.replace('mysql+pymysql://', 'mysql://')
    
    parsed = urlparse(database_url)
    
    return {
        'host': parsed.hostname,
        'port': parsed.port or 3306,
        'user': parsed.username,
        'password': parsed.password,
        'database': parsed.path.lstrip('/').split('?')[0] if parsed.path else 'lawvriksh_db',
        'ssl_required': 'ssl-mode=REQUIRED' in database_url
    }

def get_connection_params():
    """Get database connection parameters from environment"""
    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        # Production: Parse DATABASE_URL
        params = parse_database_url(database_url)
        if not params:
            raise ValueError("Invalid DATABASE_URL format")
        
        # Configure SSL for production (Aiven requires SSL)
        ssl_required = params.pop('ssl_required', False)
        if ssl_required:
            params['ssl'] = {}

        return params
    else:
        # Local development: Use individual environment variables
        return {
            'host': os.environ.get('DB_HOST', 'localhost'),
            'port': int(os.environ.get('DB_PORT', 3306)),
            'user': os.environ.get('DB_USER', 'root'),
            'password': os.environ.get('DB_PASSWORD', ''),
            'database': os.environ.get('DB_NAME', 'lawvriksh_db')
        }

def read_sql_file(file_path):
    """Read and return SQL file content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print(f"❌ SQL file not found: {file_path}")
        return None
    except Exception as e:
        print(f"❌ Error reading SQL file: {str(e)}")
        return None

def execute_sql_statements(connection, sql_content):
    """Execute SQL statements from the schema file"""
    try:
        cursor = connection.cursor()
        
        # Split SQL content into individual statements
        statements = []
        current_statement = ""
        
        for line in sql_content.split('\n'):
            line = line.strip()
            
            # Skip empty lines and comments
            if not line or line.startswith('--'):
                continue
            
            # Skip multi-line comments
            if line.startswith('/*') or line.endswith('*/'):
                continue
            
            current_statement += line + " "
            
            # If line ends with semicolon, it's end of statement
            if line.endswith(';'):
                statements.append(current_statement.strip())
                current_statement = ""
        
        # Execute each statement
        executed_count = 0
        for statement in statements:
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                    executed_count += 1
                except Exception as e:
                    print(f"⚠️  Warning executing statement: {str(e)}")
                    print(f"Statement: {statement[:100]}...")
        
        connection.commit()
        cursor.close()
        
        print(f"✅ Successfully executed {executed_count} SQL statements")
        return True
        
    except Exception as e:
        print(f"❌ Error executing SQL statements: {str(e)}")
        return False

def verify_tables(connection):
    """Verify that tables were created successfully"""
    try:
        cursor = connection.cursor()
        
        # Check if tables exist
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        
        expected_tables = ['user_registrations', 'feedback']
        created_tables = [table for table in expected_tables if table in tables]
        
        print(f"\n📊 Database Verification:")
        print(f"Expected tables: {expected_tables}")
        print(f"Created tables: {created_tables}")
        
        if len(created_tables) == len(expected_tables):
            print("✅ All tables created successfully!")
            
            # Show table structures
            for table in created_tables:
                cursor.execute(f"DESCRIBE {table}")
                columns = cursor.fetchall()
                print(f"\n📋 Table '{table}' structure:")
                for column in columns:
                    print(f"  - {column[0]} ({column[1]})")
        else:
            missing_tables = [table for table in expected_tables if table not in created_tables]
            print(f"❌ Missing tables: {missing_tables}")
        
        cursor.close()
        return len(created_tables) == len(expected_tables)
        
    except Exception as e:
        print(f"❌ Error verifying tables: {str(e)}")
        return False

def main():
    """Main function to initialize the database"""
    print("🚀 Initializing LawVriksh MySQL Database...")
    print("=" * 50)
    
    try:
        # Get connection parameters
        print("📡 Getting database connection parameters...")
        conn_params = get_connection_params()
        
        # Hide password in logs
        log_params = conn_params.copy()
        if 'password' in log_params and log_params['password']:
            log_params['password'] = '***'
        print(f"Connection: {log_params}")
        
        # Read SQL schema file
        print("\n📄 Reading schema.sql file...")
        script_dir = os.path.dirname(os.path.abspath(__file__))
        sql_file_path = os.path.join(script_dir, 'schema.sql')
        
        sql_content = read_sql_file(sql_file_path)
        if not sql_content:
            sys.exit(1)
        
        print(f"✅ SQL file loaded ({len(sql_content)} characters)")
        
        # Connect to database
        print("\n🔌 Connecting to MySQL database...")
        connection = pymysql.connect(**conn_params)
        print("✅ Database connection successful!")
        
        # Execute SQL statements
        print("\n⚙️  Executing SQL statements...")
        if not execute_sql_statements(connection, sql_content):
            sys.exit(1)
        
        # Verify tables
        print("\n🔍 Verifying table creation...")
        if not verify_tables(connection):
            sys.exit(1)
        
        # Close connection
        connection.close()
        
        print("\n" + "=" * 50)
        print("🎉 Database initialization completed successfully!")
        print("\nNext steps:")
        print("1. Your MySQL database is ready to use")
        print("2. You can now start your Flask application")
        print("3. Test the API endpoints")
        
    except Exception as e:
        print(f"\n❌ Database initialization failed: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()

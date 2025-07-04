#!/usr/bin/env python3
"""
Database initialization script for LawVriksh Feedback System
Run this script to create the database tables locally.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, create_tables

def init_database():
    """Initialize the database with all tables"""
    print("Initializing LawVriksh Feedback Database...")
    
    with app.app_context():
        try:
            # Drop all tables (use with caution in production!)
            print("Dropping existing tables...")
            db.drop_all()
            
            # Create all tables
            print("Creating new tables...")
            create_tables()
            
            print("✅ Database initialized successfully!")
            print("\nTables created:")
            print("- feedback: Stores all feedback form submissions")
            
            # Print some helpful information
            print(f"\nDatabase URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
            print("\nTo view feedback data, use the API endpoint:")
            print("GET /api/feedback (requires X-API-Key header)")
            
        except Exception as e:
            print(f"❌ Error initializing database: {str(e)}")
            sys.exit(1)

if __name__ == '__main__':
    init_database()

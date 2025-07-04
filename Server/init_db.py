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
            print("- user_registrations: Stores user and creator registrations")
            print("- feedback: Stores all feedback form submissions")

            # Print some helpful information
            db_url = app.config['SQLALCHEMY_DATABASE_URI']
            # Hide password in URL for security
            if '@' in db_url:
                parts = db_url.split('@')
                if len(parts) > 1:
                    user_part = parts[0].split('://')[-1]
                    if ':' in user_part:
                        user = user_part.split(':')[0]
                        db_url_safe = db_url.replace(user_part, f"{user}:***")
                    else:
                        db_url_safe = db_url
                else:
                    db_url_safe = db_url
            else:
                db_url_safe = db_url

            print(f"\nDatabase URL: {db_url_safe}")
            print("\nTo view feedback data, use the API endpoint:")
            print("GET /api/feedback (requires X-API-Key header)")

        except Exception as e:
            print(f"❌ Error initializing database: {str(e)}")
            sys.exit(1)

if __name__ == '__main__':
    init_database()

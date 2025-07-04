# LawVriksh Feedback API

A Flask-based REST API for handling feedback form submissions with MySQL database storage.

## Features

- ✅ Complete feedback form handling with 12 questions
- ✅ Conditional fields for low ratings (1-2 scale)
- ✅ MySQL database with proper schema
- ✅ Input validation and error handling
- ✅ CORS support for frontend integration
- ✅ Production-ready with Gunicorn
- ✅ Render.com deployment configuration
- ✅ Admin API for retrieving feedback data

## Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up MySQL Database**
   ```sql
   CREATE DATABASE lawvriksh_feedback;
   CREATE USER 'lawvriksh_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON lawvriksh_feedback.* TO 'lawvriksh_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize Database**
   ```bash
   python init_db.py
   ```

5. **Run Development Server**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

### Production Deployment (Render.com)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add feedback API backend"
   git push origin main
   ```

2. **Deploy on Render.com**
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file
   - Set up the MySQL database service
   - Deploy the web service

## API Endpoints

### POST /api/feedback
Submit a new feedback form.

**Request Body:**
```json
{
  "visualDesign": "4",
  "easeOfNavigation": "2",
  "easeOfNavigationIssue": "Navigation is confusing",
  "mobileResponsiveness": "5",
  "overallSatisfaction": "3",
  "easeOfTasks": "4",
  "qualityOfServices": "3",
  "likeMost": "Great design and features",
  "improvements": "Better navigation",
  "features": "More legal tools",
  "legalChallenges": "Contract review help",
  "additionalComments": "Keep up the good work",
  "contactWilling": "yes",
  "contactEmail": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Feedback submitted successfully",
  "id": 123,
  "submitted_at": "2024-01-15T10:30:00"
}
```

### GET /api/feedback
Retrieve all feedback submissions (Admin only).

**Headers:**
```
X-API-Key: your-admin-api-key
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 50, max: 100)

**Response:**
```json
{
  "feedback": [...],
  "total": 150,
  "pages": 3,
  "current_page": 1,
  "per_page": 50
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Database Schema

### feedback table
- `id`: Primary key
- `visual_design`: Rating 1-5
- `ease_of_navigation`: Rating 1-5
- `mobile_responsiveness`: Rating 1-5
- `overall_satisfaction`: Rating 1-5
- `ease_of_tasks`: Rating 1-5
- `quality_of_services`: Rating 1-5
- `visual_design_issue`: Text (conditional)
- `ease_of_navigation_issue`: Text (conditional)
- `mobile_responsiveness_issue`: Text (conditional)
- `overall_satisfaction_issue`: Text (conditional)
- `ease_of_tasks_issue`: Text (conditional)
- `quality_of_services_issue`: Text (conditional)
- `like_most`: Text
- `improvements`: Text
- `features`: Text
- `legal_challenges`: Text
- `additional_comments`: Text
- `contact_willing`: 'yes' or 'no'
- `contact_email`: Email address
- `submitted_at`: Timestamp
- `ip_address`: Client IP
- `user_agent`: Browser info

## Environment Variables

### Development
```env
FLASK_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lawvriksh_feedback
ADMIN_API_KEY=your-admin-key
```

### Production (Render.com)
```env
FLASK_ENV=production
DATABASE_URL=mysql+pymysql://user:pass@host:port/db
ADMIN_API_KEY=secure-random-key
```

## Security Features

- Input validation and sanitization
- SQL injection prevention via SQLAlchemy ORM
- CORS configuration for specific origins
- Admin API key authentication
- Error handling without information disclosure
- Request rate limiting (can be added with Flask-Limiter)

## Monitoring & Logging

- Structured logging with timestamps
- Error tracking and reporting
- Health check endpoint for monitoring
- Request/response logging in production

## Testing

Run the API tests:
```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest tests/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

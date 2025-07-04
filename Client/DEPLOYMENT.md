# LawVriksh Feedback System - Deployment Guide

This guide covers deploying both the frontend and backend of the LawVriksh feedback system.

## 🏗️ Architecture Overview

- **Frontend**: React + TypeScript + Vite
- **Backend**: Flask + MySQL
- **Deployment**: Render.com (recommended)

## 📋 Prerequisites

1. GitHub account
2. Render.com account
3. MySQL database (provided by Render.com)

## 🚀 Quick Deployment (Render.com)

### Step 1: Prepare Your Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add feedback system with backend"
   git push origin main
   ```

### Step 2: Deploy on Render.com

1. **Connect Repository**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect the `render.yaml` file automatically

2. **Configure Services**
   The `render.yaml` file will create:
   - MySQL database: `lawvriksh-feedback-db`
   - Backend API: `lawvriksh-feedback-api`
   - Frontend app: `lawvriksh-frontend`

3. **Set Environment Variables**
   Render will automatically set most variables, but verify:
   - `DATABASE_URL`: Auto-generated from MySQL service
   - `ADMIN_API_KEY`: Auto-generated secure key
   - `VITE_API_URL`: Set to your backend API URL

### Step 3: Verify Deployment

1. **Check Services**
   - Backend API: `https://your-api-name.onrender.com`
   - Frontend: `https://your-frontend-name.onrender.com`

2. **Test API Health**
   ```bash
   curl https://your-api-name.onrender.com/api/health
   ```

3. **Test Feedback Form**
   - Visit your frontend URL
   - Click "Suggestion & Feedback"
   - Submit a test feedback form

## 🔧 Manual Deployment

### Backend Deployment

1. **Local Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE lawvriksh_feedback;
   CREATE USER 'lawvriksh_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON lawvriksh_feedback.* TO 'lawvriksh_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize Database**
   ```bash
   python init_db.py
   ```

5. **Run Backend**
   ```bash
   # Development
   python app.py
   
   # Production
   gunicorn --config gunicorn.conf.py app:app
   ```

### Frontend Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set API URL**
   ```bash
   # .env
   VITE_API_URL=https://your-backend-api-url.com
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   npm run preview
   ```

## 🔐 Security Configuration

### Backend Security

1. **Environment Variables**
   ```env
   FLASK_ENV=production
   DATABASE_URL=mysql+pymysql://user:pass@host:port/db
   ADMIN_API_KEY=your-super-secure-random-key
   ```

2. **CORS Configuration**
   Update `app.py` with your frontend domain:
   ```python
   CORS(app, origins=[
       "https://your-frontend-domain.com"
   ])
   ```

3. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups
   - Monitor access logs

### Frontend Security

1. **Environment Variables**
   ```env
   VITE_API_URL=https://your-secure-api-domain.com
   ```

2. **HTTPS Only**
   - Ensure all API calls use HTTPS
   - Configure CSP headers
   - Enable HSTS

## 📊 Monitoring & Maintenance

### Health Checks

1. **API Health Check**
   ```bash
   curl https://your-api-url.com/api/health
   ```

2. **Database Health**
   ```bash
   # Check database connection
   python -c "from backend.app import db; print('DB OK' if db.engine.execute('SELECT 1').scalar() == 1 else 'DB Error')"
   ```

### Logs and Monitoring

1. **Backend Logs**
   - Check Render.com logs dashboard
   - Monitor error rates
   - Set up alerts for failures

2. **Database Monitoring**
   - Monitor connection pool
   - Check query performance
   - Monitor storage usage

### Backup Strategy

1. **Database Backups**
   ```bash
   # Daily backup script
   mysqldump -h host -u user -p database > backup_$(date +%Y%m%d).sql
   ```

2. **Code Backups**
   - Regular Git commits
   - Tagged releases
   - Multiple repository mirrors

## 🧪 Testing

### API Testing

1. **Run Test Suite**
   ```bash
   cd backend
   python test_api.py
   ```

2. **Manual Testing**
   ```bash
   # Test feedback submission
   curl -X POST https://your-api-url.com/api/feedback \
     -H "Content-Type: application/json" \
     -d '{"visualDesign": "4", "likeMost": "Great design"}'
   
   # Test admin endpoint
   curl -H "X-API-Key: your-admin-key" \
     https://your-api-url.com/api/feedback
   ```

### Frontend Testing

1. **Local Testing**
   ```bash
   npm run dev
   # Test feedback form functionality
   ```

2. **Production Testing**
   - Test form submission
   - Verify error handling
   - Check responsive design
   - Test loading states

## 🔄 Updates and Maintenance

### Updating the Application

1. **Code Updates**
   ```bash
   git pull origin main
   git push origin main
   # Render.com will auto-deploy
   ```

2. **Database Migrations**
   ```bash
   # Add migration script if schema changes
   python migrate_db.py
   ```

### Performance Optimization

1. **Backend Optimization**
   - Database indexing
   - Query optimization
   - Caching strategies
   - Connection pooling

2. **Frontend Optimization**
   - Code splitting
   - Asset optimization
   - CDN usage
   - Lazy loading

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database credentials
   - Check network connectivity

2. **CORS Errors**
   - Update CORS origins in backend
   - Check API URL in frontend
   - Verify HTTPS/HTTP consistency

3. **Form Submission Failures**
   - Check API endpoint URL
   - Verify request format
   - Check validation errors

### Debug Commands

```bash
# Check backend logs
render logs --service your-api-service

# Check database connection
python -c "from backend.app import app, db; app.app_context().push(); print(db.engine.execute('SELECT 1').scalar())"

# Test API locally
cd backend && python test_api.py
```

## 📞 Support

For deployment issues:
1. Check Render.com documentation
2. Review application logs
3. Test API endpoints manually
4. Verify environment variables

## 🎯 Production Checklist

- [ ] Backend deployed and healthy
- [ ] Database created and initialized
- [ ] Frontend deployed and accessible
- [ ] API endpoints working
- [ ] Feedback form functional
- [ ] Admin access configured
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Monitoring set up
- [ ] Backup strategy implemented

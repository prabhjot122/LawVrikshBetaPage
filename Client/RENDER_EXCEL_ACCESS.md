# Accessing Excel Files on Render.com Deployment

## 🚨 **Important: Render.com Limitations**

Render.com uses **ephemeral file systems**, which means:
- Files saved to disk are **temporary**
- Files are **deleted when service restarts**
- No persistent local file storage available

## 🎯 **Solution: API-Based Excel Download**

The best approach is to generate Excel files **on-demand** via API endpoints.

### **How It Works:**
1. **Data Storage**: All data stored in SQLite database (persistent)
2. **Excel Generation**: Generated dynamically when requested
3. **No File Storage**: No files saved to disk in production
4. **API Download**: Download Excel via secure API endpoint

## 📥 **Accessing Excel Files in Production**

### **Method 1: Direct API Download**

**Endpoint**: `GET /api/download-excel`

**Example using curl:**
```bash
curl -H "X-API-Key: YOUR_ADMIN_API_KEY" \
     -o "lawvriksh_data.xlsx" \
     https://your-app-name.onrender.com/api/download-excel
```

**Example using browser:**
```
https://your-app-name.onrender.com/api/download-excel
```
*(Add X-API-Key header using browser extension or developer tools)*

### **Method 2: Admin Dashboard (Future Enhancement)**

Create a simple admin web interface:

```html
<!-- Admin page with download button -->
<button onclick="downloadExcel()">Download Excel Report</button>

<script>
async function downloadExcel() {
    const response = await fetch('/api/download-excel', {
        headers: {
            'X-API-Key': 'YOUR_ADMIN_API_KEY'
        }
    });
    
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lawvriksh_data_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click();
    }
}
</script>
```

### **Method 3: Scheduled Email Reports**

Set up automated email delivery of Excel reports:

```python
# Add to backend/app.py
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def send_excel_report_email(recipient_email):
    """Send Excel report via email"""
    excel_buffer = generate_excel_report()
    if not excel_buffer:
        return False
    
    # Email configuration
    msg = MIMEMultipart()
    msg['From'] = os.environ.get('SMTP_FROM_EMAIL')
    msg['To'] = recipient_email
    msg['Subject'] = f"LawVriksh Data Report - {datetime.now().strftime('%Y-%m-%d')}"
    
    # Attach Excel file
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(excel_buffer.getvalue())
    encoders.encode_base64(part)
    part.add_header(
        'Content-Disposition',
        f'attachment; filename="lawvriksh_data_{datetime.now().strftime("%Y%m%d")}.xlsx"'
    )
    msg.attach(part)
    
    # Send email
    try:
        server = smtplib.SMTP(os.environ.get('SMTP_HOST'), 587)
        server.starttls()
        server.login(os.environ.get('SMTP_USER'), os.environ.get('SMTP_PASS'))
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        logger.error(f'Error sending email: {str(e)}')
        return False
```

## 🔐 **Security for Production**

### **Environment Variables on Render:**

Set these in your Render.com service settings:

```env
# Required
FLASK_ENV=production
ADMIN_API_KEY=your-super-secure-random-key-here

# Optional (for email reports)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

### **API Key Security:**
- Use a strong, randomly generated API key
- Store in Render environment variables
- Never commit to code repository
- Rotate periodically

## 📊 **Excel File Contents**

The downloaded Excel file will contain:

### **Sheet 1: User Registrations**
- All users who joined waiting list (USER/Creator)
- Real-time data from database

### **Sheet 2: Feedback Submissions**
- All feedback form responses
- Including conditional fields for low ratings
- Real-time data from database

## 🔄 **Deployment Workflow**

### **Step 1: Deploy to Render**
```bash
git add .
git commit -m "Add Excel functionality"
git push origin main
```

### **Step 2: Set Environment Variables**
In Render.com dashboard:
- Go to your service settings
- Add environment variables
- Set `ADMIN_API_KEY` to a secure value

### **Step 3: Test Excel Download**
```bash
curl -H "X-API-Key: YOUR_ADMIN_API_KEY" \
     -o "test.xlsx" \
     https://your-app.onrender.com/api/download-excel
```

### **Step 4: Verify Data**
- Open downloaded Excel file
- Check both sheets have data
- Verify all columns are present

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **401 Unauthorized**
   - Check API key is correct
   - Verify X-API-Key header is set

2. **500 Internal Server Error**
   - Check Render logs for database issues
   - Verify all dependencies installed

3. **Empty Excel File**
   - Check if data exists in database
   - Verify database connection

### **Debug Commands:**

```bash
# Check if service is running
curl https://your-app.onrender.com/api/health

# Check data exists
curl -H "X-API-Key: YOUR_KEY" \
     https://your-app.onrender.com/api/registrations

curl -H "X-API-Key: YOUR_KEY" \
     https://your-app.onrender.com/api/feedback
```

## 📈 **Advanced Options**

### **Option A: Cloud Storage Integration**

For persistent file storage, integrate with cloud services:

```python
# AWS S3 Integration
import boto3

def save_excel_to_s3(excel_buffer):
    s3 = boto3.client('s3')
    s3.put_object(
        Bucket='your-bucket',
        Key=f'reports/lawvriksh_data_{datetime.now().strftime("%Y%m%d")}.xlsx',
        Body=excel_buffer.getvalue()
    )
```

### **Option B: Database BLOB Storage**

Store Excel files directly in database:

```python
class ExcelReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

## 🎯 **Recommended Approach**

For most use cases, **API-based download** is the best solution:

1. ✅ **Simple**: No additional services needed
2. ✅ **Reliable**: Always generates fresh data
3. ✅ **Secure**: API key authentication
4. ✅ **Cost-effective**: No storage costs
5. ✅ **Real-time**: Always current data

## 📞 **Support**

If you need help accessing Excel files in production:
1. Check Render service logs
2. Verify API endpoints are working
3. Test with curl commands
4. Contact support with specific error messages

The API-based approach ensures you can always access your Excel data, regardless of Render's file system limitations!

# Hospital Website Project

A complete hospital website with separate frontend and backend, featuring appointment booking, contact forms, and email notifications.

## Project Structure

\`\`\`
hospital-website/
├── frontend/
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── appointment.html
│   ├── contact.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── backend/
    ├── server.js
    ├── package.json
    ├── .env.example
    └── README.md
\`\`\`

## Features

### Frontend
- **Responsive Design**: Mobile-first approach with modern CSS
- **Multiple Pages**: Home, About, Services, Appointment, Contact
- **Interactive Forms**: Appointment booking and contact forms
- **Google Maps Integration**: Hospital location and directions
- **Accessibility**: WCAG compliant with proper ARIA labels

### Backend
- **RESTful API**: Express.js server with proper routing
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer for appointment confirmations
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Input validation and sanitization

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

2. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in .env file

4. **Email Configuration**
   - Set up Gmail App Password or SMTP service
   - Update email credentials in .env file

5. **Start Server**
   \`\`\`bash
   npm run dev  # Development mode
   npm start    # Production mode
   \`\`\`

### Frontend Setup

1. **Serve Static Files**
   \`\`\`bash
   cd frontend
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx serve -p 8080
   
   # Using Live Server (VS Code extension)
   # Right-click index.html and select "Open with Live Server"
   \`\`\`

2. **Update API Endpoints**
   - Ensure frontend JavaScript points to correct backend URL
   - Default: `http://localhost:3000`

## API Endpoints

### Appointments
- `POST /api/appointments` - Book new appointment
- `GET /api/appointments` - Get all appointments (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Get all contacts (admin)

### Utility
- `GET /api/health` - Health check
- `GET /api/directions` - Hospital location data

## Database Schema

### Appointments
\`\`\`javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required),
  phone: String (required),
  dateOfBirth: Date (required),
  gender: String (required),
  address: String,
  department: String (required),
  doctor: String,
  appointmentDate: Date (required),
  appointmentTime: String (required),
  reason: String (required),
  insurance: String,
  status: String (default: 'pending'),
  createdAt: Date (default: now)
}
\`\`\`

### Contacts
\`\`\`javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  status: String (default: 'new'),
  createdAt: Date (default: now)
}
\`\`\`

## Email Templates

The system sends automated emails for:
- Appointment confirmations to patients
- New appointment notifications to hospital staff
- Contact form confirmations to senders
- New contact notifications to hospital staff

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents spam and abuse
- **Input Validation**: Server-side validation
- **Environment Variables**: Secure configuration

## Customization

### Adding New Services
1. Update `services.html` with new service information
2. Add service option to appointment form dropdown
3. Update backend validation if needed

### Styling Changes
- Modify `frontend/css/style.css`
- Update color scheme in CSS variables
- Customize responsive breakpoints

### Email Templates
- Edit email HTML in `backend/server.js`
- Add hospital branding and styling
- Customize confirmation messages

## Deployment

### Frontend Deployment
- Deploy to Netlify, Vercel, or GitHub Pages
- Update API URLs for production

### Backend Deployment
- Deploy to Heroku, Railway, or DigitalOcean
- Set environment variables in hosting platform
- Use MongoDB Atlas for database

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check frontend URL in backend CORS configuration
2. **Email Not Sending**: Verify SMTP credentials and app passwords
3. **Database Connection**: Ensure MongoDB is running and URI is correct
4. **Form Submission**: Check network tab for API call errors

### Development Tips
- Use browser developer tools for debugging
- Check server logs for backend errors
- Test email functionality with test accounts
- Validate forms before submission

## License

MIT License - feel free to use for your hospital or medical facility.

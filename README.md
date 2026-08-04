# Glow Skincare Clinic Website

A premium, fully responsive, static web application for a skincare clinic built with HTML, CSS, JavaScript, and Bootstrap 5. 

## 🌟 Features

- **8 Complete Pages**: Home, About Us, Services, Gallery, Testimonials, Blog, Appointment, and Contact Us.
- **Premium Design**: Custom beige color palette tailored for skincare and wellness brands.
- **SEO Optimized**: Semantic HTML5 structure with proper meta tags for better search engine visibility.
- **Custom JS Chatbot**: A floating smart assistant loaded with 80 skincare FAQs (partitioned into groups of 10) and quick action buttons for Call, WhatsApp, and Booking.
- **Floating Action Buttons (FAB)**: Global quick-access buttons for direct calling and WhatsApp messaging.
- **Functional Contact Form**: Integrated with **SmtpJS** to send emails directly from the browser using standard SMTP credentials.
- **Interactive Maps**: Embedded Google Maps pointing to the clinic location (RK University).

## 📁 Folder Structure

```text
/Dream To Be
│
├── index.html           # Home Page
├── about.html           # About Us
├── services.html        # Services & Treatments
├── gallery.html         # Image Gallery
├── appointment.html     # Booking Form
├── testimonials.html    # Customer Reviews
├── blog.html            # Articles & Tips
├── contact.html         # Contact Form & Map
│
├── css/
│   └── style.css        # Custom styles, theme colors, chatbot & FAB UI
│
└── js/
    ├── script.js        # Navbar logic and active state handling
    └── chatbot.js       # Chatbot logic, 80 Q&A database, and FAB injection
```

## 🚀 Getting Started

Since this is a purely static website, there is no need to run a backend server (like Node.js or PHP). 

1. Clone or download the repository to your local machine.
2. Open the folder `Dream To Be`.
3. Double-click on `index.html` to open the website in your default web browser.
4. Navigate through the pages using the top navigation menu.

## ✉️ Contact Form Configuration

The contact form in `contact.html` uses [SmtpJS](https://smtpjs.com/) to send emails directly from the client side without needing a backend server. 

**Note on Security:** 
The current configuration uses raw SMTP credentials embedded in the JavaScript (`contact.html` line 147+). While this works out-of-the-box for simple static deployments, it is highly recommended to use the **SecureToken** feature provided by SmtpJS in a production environment to prevent exposing your email password.

## 🛠️ Built With

- **HTML5 & CSS3**
- **JavaScript (Vanilla)**
- **Bootstrap 5.3.0** (via CDN)
- **FontAwesome 6.4.0** (via CDN for icons)
- **Google Fonts** (Inter & Playfair Display)
- **SmtpJS** (for email sending)

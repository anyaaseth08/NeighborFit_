# NeighborFit - Neighborhood Discovery Platform

A comprehensive React-based platform for discovering, comparing, and reviewing neighborhoods across India. Find your perfect community with advanced search, detailed comparisons, and authentic resident reviews.

![NeighborFit Platform](https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1200)

## 🌟 Features

### 🏠 **Neighborhood Discovery**
- Browse neighborhoods across major Indian cities (Bangalore, Mumbai, Delhi, etc.)
- Advanced filtering by price range, safety ratings, schools, transit, and lifestyle features
- Interactive search with real-time results
- Detailed neighborhood profiles with comprehensive information

### 📊 **Smart Comparison**
- Side-by-side comparison of up to 3 neighborhoods
- Compare ratings across safety, schools, transit, nightlife, and cost of living
- Visual progress bars and detailed metrics
- Export comparison data

### ⭐ **Community Reviews**
- Authentic reviews from actual residents
- Detailed rating system with pros and cons
- Helpful voting system for review quality
- Photo galleries and neighborhood insights

### 🎯 **Personalized Recommendations**
- AI-powered recommendations based on user preferences
- Budget-based filtering and suggestions
- Lifestyle matching algorithm
- Commute optimization

### 🌙 **Modern User Experience**
- Dark/Light mode toggle with system preference detection
- Fully responsive design for all devices
- Progressive Web App capabilities
- Smooth animations and micro-interactions

### 🏫 **Detailed Information Pages**
- **Schools**: Detailed school information, facilities, achievements, contact forms
- **Nightlife**: Restaurant and bar details, reservations, menu access
- **Local Services**: Moving services, utilities, local agents

### 👤 **User Management**
- Secure authentication system
- User profiles with housing preferences
- Saved neighborhoods and favorites
- Admin dashboard for content management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/neighborfit-platform.git
   cd neighborfit-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### State Management
- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic

### Development Tools
- **ESLint** - Code linting and quality
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   └── PrivateRoute.tsx # Protected route wrapper
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── NeighborhoodContext.tsx # Neighborhood data
│   └── ThemeContext.tsx # Dark/light mode
├── pages/              # Main application pages
│   ├── Home.tsx        # Landing page
│   ├── Browse.tsx      # Neighborhood browsing
│   ├── Compare.tsx     # Comparison tool
│   ├── NeighborhoodDetail.tsx # Detailed view
│   ├── SchoolsDetail.tsx # School information
│   ├── NightlifeDetail.tsx # Nightlife venues
│   ├── Profile.tsx     # User profile
│   ├── Login.tsx       # Authentication
│   ├── Register.tsx    # User registration
│   └── Admin.tsx       # Admin dashboard
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Green (#059669) - Trust, growth, nature
- **Secondary**: Gray (#6B7280) - Professional, modern
- **Accent**: Yellow (#F59E0B) - Energy, optimism
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Inter font family, multiple weights
- **Body**: System font stack for optimal readability
- **Line Heights**: 150% for body text, 120% for headings

### Spacing System
- **Base Unit**: 8px
- **Consistent spacing** using Tailwind's spacing scale
- **Responsive breakpoints** for all screen sizes

## 🔐 Authentication

The platform includes a complete authentication system:

### User Roles
- **Regular Users**: Browse, compare, review neighborhoods
- **Admin Users**: Manage content, moderate reviews, access analytics

### Features
- Secure login/logout functionality
- User registration with validation
- Password strength indicators
- Remember me functionality
- Profile management

### Demo Accounts
Create your own account through the registration process. No demo credentials are provided for security.

## 📱 Responsive Design

NeighborFit is fully responsive and optimized for:
- **Desktop**: Full-featured experience with side-by-side comparisons
- **Tablet**: Optimized layouts with touch-friendly interactions
- **Mobile**: Mobile-first design with collapsible navigation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push to main branch

### Vercel
1. Import project from GitHub
2. Vercel will auto-detect Vite configuration
3. Deploy with zero configuration

### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder to your web server
3. Configure server for SPA routing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pexels** - High-quality stock photos
- **Lucide** - Beautiful icon library
- **Tailwind CSS** - Utility-first CSS framework
- **React Community** - Amazing ecosystem and tools

## 📞 Support

For support, email support@neighborfit.com or create an issue in the GitHub repository.

## 🗺 Roadmap

### Upcoming Features
- [ ] Interactive maps integration
- [ ] Real estate price predictions
- [ ] Virtual neighborhood tours
- [ ] Community forums
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added dark mode and enhanced UI
- **v1.2.0** - Implemented detailed pages for schools and nightlife
- **v1.3.0** - Enhanced authentication and user management

---

**Built with ❤️ for finding the perfect neighborhood in India**

[Live Demo](https://neighbor-fit-cyan-chi.vercel.app/) | [Documentation](https://docs.neighborfit.com) | [API Reference](https://api.neighborfit.com/docs)

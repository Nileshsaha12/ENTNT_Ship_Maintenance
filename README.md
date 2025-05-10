# ENTNT Ship Maintenance Dashboard

A React-based ship maintenance management system that simulates an internal system for managing ships, their components, and maintenance jobs.

## Overview

The Ship Maintenance Dashboard is a frontend-only application that provides a complete solution for managing ship maintenance operations. The application includes user authentication, ships management, components management, maintenance jobs, calendar view, and notifications.

## Features

- **User Authentication (Simulated)**
  - Hardcoded users with roles: Admin, Inspector, Engineer
  - Session persistence with localStorage
  - Role-based access control

- **Ships Management**
  - List, create, edit, and delete ships
  - View detailed ship profiles

- **Components Management**
  - Add, edit, and delete components linked to ships
  - Track component details and maintenance history

- **Maintenance Jobs Management**
  - Create and manage maintenance jobs
  - Filter jobs by ship, status, and priority

- **Maintenance Calendar**
  - Monthly and weekly calendar views
  - Visual representation of scheduled jobs

- **Notification Center**
  - In-app notification system
  - Tracks job creation, updates, and completions

- **KPI Dashboard**
  - Visual representation of important metrics
  - Charts for job priorities and statuses

## Tech Stack

- React (Functional Components)
- React Router for navigation
- Context API for state management
- Material-UI for styling
- LocalStorage for data persistence
- Recharts for data visualization

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/Nileshsaha12/ENTNT_Ship_Maintenance
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Application Structure

The application is organized into the following main directories:

- `/src/components`: UI components organized by feature
- `/src/contexts`: Context providers for global state management
- `/src/pages`: Main application pages/routes
- `/src/utils`: Utility functions and helpers

## Demo Users

The application comes with three pre-configured users:

1. **Admin**
   - Email: admin@entnt.in
   - Password: admin123
   - Permissions: Full access to all features

2. **Inspector**
   - Email: inspector@entnt.in
   - Password: inspect123
   - Permissions: Can view ships and components, create maintenance jobs

3. **Engineer**
   - Email: engineer@entnt.in
   - Password: engine123
   - Permissions: Can view ships and update maintenance job status

## Known Limitations

- Being a frontend-only application, all data is stored in localStorage and will be cleared if browser data is cleared
- The calendar view has limited functionality compared to dedicated calendar applications
- No email notifications since this is a frontend-only application
- Limited user management features (cannot create new users)

## Technical Decisions

1. **Material-UI**: Selected for its comprehensive component library and responsive design system that made building a professional UI faster

2. **Context API**: Used for state management as it provided a simpler solution than Redux for this application scale

3. **localStorage**: Implemented custom utility functions to handle CRUD operations on localStorage, simulating a backend API

4. **Role-based Access Control**: Implemented a permission system at the UI level to restrict access based on user roles

5. **Component Structure**: Organized by feature rather than type to improve code maintainability and readability

## Deployment

The application is deployed and available at: [https://entnt-ship-maintenance-75sv181wi-nilesh-sahas-projects.vercel.app](https://entnt-ship-maintenance-75sv181wi-nilesh-sahas-projects.vercel.app)

## Future Enhancements

- Dark mode support
- Export reports functionality
- Advanced filtering and search capabilities
- User profile management
- Maintenance history timeline view

## License

This project is licensed under the MIT License.

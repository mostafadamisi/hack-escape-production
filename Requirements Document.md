Hack & Escape Admin Dashboard
Requirements Document
1. Project Overview
The goal of this project is to build a separate Admin Dashboard for the Hack & Escape website.
The dashboard should be independent from the main website in terms of access and interface, but fully connected to it in terms of content and data.
The purpose of the dashboard is to allow the admin to manage and update specific sections of the main website without editing the code manually.
________________________________________
2. Scope of Work
The Admin Dashboard will manage the following sections of the main Hack & Escape website:
•	Team 
•	Gallery 
•	Media 
•	Sponsors Logos 
Any content added, edited, or deleted in the Admin Dashboard must be reflected on the main website automatically.
________________________________________
3. General Requirements
3.1 Dashboard Separation
The Admin Dashboard must:
•	Be separate from the public website 
•	Have its own secure access/login 
•	Be connected to the same database or content source as the main website 
3.2 Content Synchronization
All updates made through the dashboard must be displayed on the main website in real time or immediately after saving.
3.3 Admin Permissions
The admin must be able to:
•	Add new content 
•	Edit existing content 
•	Delete existing content 
•	View all uploaded content 
This applies to all sections in the dashboard.
________________________________________
4. Dashboard Structure
The Admin Dashboard should include a navigation menu with the following sections:
•	Team 
•	Gallery 
•	Media 
•	Sponsors Logos 
Each section should have its own dedicated management page or module.
________________________________________
5. Functional Requirements
5.1 Team Management
Purpose
This section manages the team members displayed on the Team page of the main website.
Admin Inputs
The admin should be able to add the following fields for each team member:
•	Member Name 
•	Position / Role 
•	LinkedIn Profile URL 
Required Features
•	Add a new team member 
•	Edit an existing team member 
•	Delete a team member 
•	View all team members in a list/table 
Frontend Reflection
The entered data must be displayed automatically on the Team page of the main website.
________________________________________
5.2 Gallery Management
Purpose
This section manages the images displayed on the Gallery page of the main website.
Admin Inputs
The admin should be able to:
•	Upload an image 
•	Add a title for the image 
Required Features
•	Add a new gallery item 
•	Edit the image title 
•	Replace the uploaded image if needed 
•	Delete a gallery item 
•	View all gallery items in a list or grid 
Frontend Reflection
The uploaded images and titles must appear automatically on the Gallery page of the main website.
________________________________________
5.3 Media Management
Purpose
This section manages the media coverage and press links related to the first edition of Hack & Escape.
Admin Inputs
The admin should be able to add:
•	News/Article URL 
•	Media Outlet Name 
•	Short Caption / Description 
Required Features
•	Add a new media entry 
•	Edit an existing media entry 
•	Delete a media entry 
•	View all media entries in a list/table 
Frontend Reflection
The media entries must appear on the Media page of the main website in the form of rectangular cards.
Each media card should display:
•	Media outlet name 
•	Short caption 
When the user clicks on a card, the news/article link should open in a new browser tab.
________________________________________
5.4 Sponsors Logos Management
Purpose
This section manages the sponsors’ logos displayed on the Home Page of the main website.
Admin Inputs
The admin should be able to:
•	Upload a sponsor logo image 
Required Features
•	Add a new sponsor logo 
•	Edit/replace an existing logo 
•	Delete a sponsor logo 
•	Optionally reorder logos 
Frontend Reflection
The uploaded sponsor logos must be displayed on the Home Page as a moving logo strip / slider / marquee, showing all current sponsor logos continuously.
________________________________________
6. Authentication and Security
6.1 Admin Login
The dashboard should be protected by a secure login page.
Minimum Login Requirements
•	Email or username 
•	Password 
Security Requirements
•	Unauthorized users must not be able to access the dashboard 
•	Admin routes/pages must be protected 
•	Only authenticated admins can create, edit, or delete content 
________________________________________
7. CRUD Requirements
Each section in the dashboard must support full CRUD operations:
•	Create new items 
•	Read/View existing items 
•	Update/Edit items 
•	Delete items 
A confirmation message or popup should appear before deleting any item.
________________________________________
8. File Upload Requirements
8.1 Image Uploads
For Gallery and Sponsors Logos, the system should support image uploads from the admin’s device.
Recommended Behavior
•	Validate file type 
•	Support image preview before saving 
•	Store images properly for frontend display 
________________________________________
9. Main Website Display Requirements
9.1 Team Page
Display team members as cards or blocks containing:
•	Member name 
•	Position 
•	LinkedIn link/icon 
9.2 Gallery Page
Display uploaded gallery images with their titles in a clean visual layout such as:
•	Grid 
•	Masonry layout 
9.3 Media Page
Display media entries as clickable cards/rectangles containing:
•	Media outlet name 
•	Caption 
On click:
•	Open the entered URL in a new tab 
9.4 Home Page Sponsors Section
Display sponsor logos in an animated horizontal strip, carousel, or marquee section.
________________________________________
10. Suggested Data Structure
10.1 Team
Fields:
•	id 
•	name 
•	position 
•	linkedin_url 
•	created_at 
•	updated_at 
10.2 Gallery
Fields:
•	id 
•	image 
•	title 
•	created_at 
•	updated_at 
10.3 Media
Fields:
•	id 
•	media_name 
•	link 
•	caption 
•	created_at 
•	updated_at 
10.4 Sponsors Logos
Fields:
•	id 
•	logo_image 
•	created_at 
•	updated_at 
________________________________________
11. UI/UX Requirements for Admin Dashboard
The Admin Dashboard should be:
•	Clean 
•	Simple 
•	Easy to use 
•	Well organized 
•	Fast for content management 
Recommended layout:
•	Sidebar navigation 
•	Separate page/module for each section 
•	Clear action buttons such as Add, Edit, Delete 
•	Tables or cards for listing content 
________________________________________
12. Technical Expectations
12.1 Backend
The system should include:
•	Database tables or collections for the four sections 
•	API endpoints or backend integration for content management 
•	Proper storage for uploaded images 
12.2 Frontend
The Admin Dashboard should be accessible through a separate route such as:
•	/admin 
or a separate subdomain such as:
•	admin.hackandescape.com 
12.3 Integration
The main website should fetch dynamic data from the backend/database rather than relying on hardcoded static content.
________________________________________
13. Final Deliverable
The final deliverable should be a fully functional Admin Dashboard connected to the Hack & Escape main website, allowing the admin to manage:
•	Team members 
•	Gallery images 
•	Media links 
•	Sponsor logos 
with full ability to:
•	Add 
•	Edit 
•	Delete 
•	View content 
and have all changes reflected on the public website automatically.

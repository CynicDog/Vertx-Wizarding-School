# Vertx Wizarding School

Welcome to Vertx Wizarding School, a Harry Potter-themed microservice architecture application. This magical world-inspired application aims to provide an enchanting experience for users while navigating through the various domains and services.


## Domains and Services

### 1. `public-api-server`: Publish public endpoints where entry points of client and server interactions are shaped.

- **Public Endpoints:**

    - Publishes and manages public endpoints that serve as the entry points for client and server interactions.
    - Defines API routes and endpoints that allow external entities, including the client-rendering-server, to communicate with the various microservices.
    
- **Security and Access Control Service:**

    - Handles user authentication by verifying credentials and generating authentication tokens.
    - Manages access control policies to restrict or grant access to specific microservices based on user roles and permissions.
  
### 2. `client-rendering-server`:

- **Communication with Microservices:**
    - Acts as an intermediary between the user interface and the backend microservices.
    - Handles asynchronous communication to update the UI in real-time as data is received from the server.

- **State Management:**
    - Manages the client-side state of the application, ensuring a seamless and responsive user experience.
    - Keeps track of user sessions, authentication status, and other relevant information to maintain application state.

### 3. `user-service`: School Enrollment and Security (User Application and Security)

- **User Application Service:**
    - Manages the user application process for Hogwarts School, including personal information, previous education, and motivation for attending Hogwarts.
    - Handles user registration and account creation.

### 4. `house-service`: House Sorting and House Management (House Domain)

- **House Sorting Service:**
    - Sorts students into one of the four Hogwarts houses (Gryffindor, Slytherin, Hufflepuff, or Ravenclaw) based on user attributes and characteristics.
    - May involve a sorting hat-like feature.

- **House Quota and Material Management Service:**
    - Manages the house quota, ensuring a balanced distribution of students across houses.
    - Tracks the stock of materials and resources in each house's dormitory (e.g., food, textbooks, common room items).

- **Invitation letter**
    - Generates personalized invitation letters for newly accepted students.

### 5. `educational-hub-service`: Wizarding Subjects and Homework (New Domain)

- **Curriculum and Class Registration Service:**
    - Manages the wizarding subjects and classes available at Hogwarts, including core subjects like Potions and Defense Against the Dark Arts.
    - Allows students to register for classes and create their academic schedules.

- **Homework and Assignment Tracking Service:**
    - Tracks homework assignments, projects, and deadlines for each subject.
    - Provides a platform for students to submit their homework and receive feedback from professors.

- **Grading and Progress Tracking Service:**
    - Enables professors to evaluate and grade student assignments and assessments.
    - Provides students with a way to track their academic progress and receive their house points based on performance.

## Interactions

- After successfully applying to Hogwarts through the User Application Service, students are sorted into houses using the House Sorting Service.

- Once sorted, students can register for wizarding subjects and create their academic schedules through the Curriculum and Class Registration Service.

- Students receive homework assignments and deadlines from their professors, and they can track and submit assignments through the Homework and Assignment Tracking Service.

- Professors use the Grading and Progress Tracking Service to assess student assignments and provide feedback, which contributes to students' academic progress and house point totals.


## Contributing

We welcome contributions to enhance and expand the Hogwarts School of Witchcraft and Wizardry Application. Feel free to create pull requests, report issues, and join our community.
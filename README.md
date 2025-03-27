# **Assignment: Full-Stack CRUD Application Development with DevOps Practices**

## JIRA board URL
```
https://ifn636-software-lifecycle.atlassian.net/jira/software/projects/IMS/boards/34
```

## CICD workflow explained

- Github action is triggered only on push to the main branch
- Workflow is run on self-hosted AWS EC2 instance

1. latest code is checkouted in the runner
2. node 22 is set up
3. stop the pm2 service
4. install npm package for backend
5. install npm package for frontend & build the frontend
6. run test on backend product crud service
7. install package in root folder
8. create/modify .env for backend
9. use pm2 to serve frontend & start backend service


## Project setup instruction
1. git clone the repository to your local computer
2. cd to root folder, run `npm run install-all`
3. run `npm run dev` to start frontend & backend locally


## **Objective**

You have been provided with a starter project that includes user authentication using  **Node.js, React.js, and MongoDB**. Your task is to extend this application by implementing **CRUD (Create, Read, Update, Delete) operations** for a real-world application of your choice, while following industry best practices such as:

* **Project Management with JIRA**
* **Requirement Diagram using SysML**
* **Version Control using GitHub**
* **CI/CD Integration for Automated Deployment**

## **Requirements**

### **1. Choose a Real-World Application**

Select a meaningful use case for your CRUD operations. We will provide the list, you have to select it.

### **2. Project Management with JIRA and SysML**

* Create a **JIRA project** and define:
  * **Epic**
  * **User Stories** (features required in your app)
  * **Child issues & Subtasks** (breaking down development work)
  * **Sprint Planning** (organizing work into milestones)
* Document your JIRA **board URL** in the project README.
* Draw a requirements diagram

### **3. Backend Development (Node.js + Express + MongoDB)**

* Create a user-friendly interface to interact with your API (Some portion developed, follow task manager app)).
* Implement **forms** for adding and updating records.
* Display data using  **tables, cards, or lists (Follow how we showed data in task manager app)**

### **4. Frontend Development (React.js)**

* Create a user-friendly interface to interact with your API (**Some portion developed, follow task manager app)**.
* Implement **forms** for adding, showing, deleting and updating records (CRUD).
* Display data using  **tables, cards, or lists (Follow how we showed data in task manager app)**

### **5. Authentication & Authorization**

* Ensure **only authenticated users** can access and perform CRUD operations. (Already developed in your project)
* Use **JWT (JSON Web Tokens)** for user authentication (Use the task manager one from .env file).

### **6. GitHub Version Control & Branching Strategy**

* Use **GitHub for version control** and maintain:
  * `main` branch (stable production-ready code)
  * Feature branches (`feature/xyz`) for each new functionality
* Follow proper **commit messages** and  **pull request (PR) reviews** .

### **7. CI/CD Pipeline Setup**

* Implement a **CI/CD pipeline using GitHub Actions** to:
  * Automatically **run tests** on every commit/pull request (Optional).
  * Deploy the **backend** to **AWS** .
  * Deploy the **frontend** to **AWS**.
* Document your  **CI/CD workflow in the README** .

## **Submission Requirements**

* **JIRA Project Board URL** (user stories ).
* **Requirment diagram** (Using project features)
* **GitHub Repository** (`backend/` and `frontend/`).
* **README.md** with:

  * Project setup instructions.
  * CI/CD pipeline details.

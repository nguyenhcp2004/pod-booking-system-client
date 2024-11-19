<div align="center">
  <br />
    <a href="https://flexipod.site/" target="_blank">
      <img src="https://flexipod.site/assets/homePageBanner-BtHd3PD-.png" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react" />
    <img src="https://img.shields.io/badge/-MySQL-black?style=for-the-badge&logoColor=white&logo=mysql&color=4169E1" alt="mysql" />
    <img src="https://img.shields.io/badge/-Tanstack Query-black?style=for-the-badge&logoColor=white&logo=reactquery&color=red" alt="react-query" />
    <img src="https://img.shields.io/badge/-React Hook Form-black?style=for-the-badge&logoColor=white&logo=reacthookform&color=EC5990" alt="react-hook-form" />
    <img src="https://img.shields.io/badge/-Zod-black?style=for-the-badge&logoColor=white&logo=zod&color=3E67B1" alt="zod" />
  </div>


<h3 align="center">FlexiPod</h3>

   <div align="center">
     This project was built for the Pod Booking System.!
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>

Built with React to handle the user interface, Google Calendar to sync booked schedules, VnPay to process payments, MySQL (serverless) to manage databases, and styled with MUI, FlexiPod is a perfect web app. Its main goal is to provide customers with a more convenient way to book spaces.

## <a name="tech-stack">⚙️ Tech Stack</a>

- React 
- Tanstack Query
- Firebase
- MySQL
- React Hook Form
- zod
- Stomp client
- MUI

## <a name="features">🔋 Features</a>

👉 **Onboarding Flow**: Seamless user registration and setup process.

👉 **oAuth Using Google**: Easy login using Google credentials.

👉 **Authorization**: Secure access control for different user roles.

👉 **View Room Type**: View a list of room types.

👉 **Book Room**: Book available rooms and amenities.

👉 **Book Amenities**: Book amenities available for the rooms you have reserved.

👉 **Send Google Calendar Invite After Successful Payment**: Send a Google Calendar invite after confirming payment.

👉 **Profile**: View account details in the profile screen.

👉 **History Booking**: Review all rooms booked so far.

👉 **Cancel Booking**: Cancel room booking.

👉 **Manage Order**: Create, and update information of order.

👉 **Manage Order Amenity**: Create, and update information of order amenity.

👉 **Manage Building**: CRUD with building.

👉 **Manage Amenity**: CRUD with amenity.

👉 **Manage account user**: Create, update, and ban accounts in real-time.

👉 **Manage assignment**: The admin or manager can view and assign a shift for staff at the location.

👉 **Responsive on mobile and pc**: Optimized for both mobile and pc devices.

and many more, including code architecture and reusability

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/nguyenhcp2004/pod-booking-system-client.git
cd pod-booking-system-client
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
VITE_API_ENDPOINT=
VITE_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_AUTHORIZED_REDIRECT_URI=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_VNPAY_RETURN_URL=
VITE_VNPAY_RETURN_URL_AMENITY=
VITE_VNPAY_RETURN_ADMIN_URL=
VITE_VNPAY_RETURN_STAFF_AMENITY_URL=
VITE_SOCKET_URL=
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_MEASUREMENT_ID=
```

Replace the placeholder values with your actual credentials. You can send mail for me to get .env for testing.

**Running the Project**

```bash
npm run dev
```

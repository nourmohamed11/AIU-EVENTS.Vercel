<template>
  <div>
    <head>
      <!-- Meta and CSS Preload Links -->
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AIUSU - Alamein International University Student Union</title>

      <!-- Favicon and Touch Icons -->
      <link rel="apple-touch-icon" sizes="180x180" href="/images/Fav/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/images/Fav/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/images/Fav/favicon-16x16.png">
      <link rel="manifest" href="/images/Fav/site.webmanifest">
      <link rel="mask-icon" href="/images/Fav/safari-pinned-tab.svg" color="#5bbad5">
      <meta name="msapplication-TileColor" content="#da532c">
      <meta name="theme-color" content="#ffffff">

      <!-- SEO Meta Tags -->
      <meta name="description" content="AIUSU provides comprehensive information for students at Alamein International University. Learn about committees, how to join, and student elections.">
      <meta name="keywords" content="Alamein International University Student Union, AIUSU, Student Committees, Student Elections, Join the Union, Study in Egypt, University Life, Job Opportunities, Scholarships, Student Communication">

      <!-- Stylesheets -->
      <link rel="stylesheet" href="/css/bootstrap.min.css">
      <link rel="stylesheet" href="/css/fontawsom-all.min.css">
      <link rel="stylesheet" href="/plugins/slider/css/owl.carousel.min.css">
      <link rel="stylesheet" href="/plugins/slider/css/owl.theme.default.css">
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <nav class="navbar">
      <div class="logo-container">
        <router-link to="/">
          <img :src="logoSrc" alt="AIUSU Logo" class="logo" />
        </router-link>
      </div>
      <div class="nav-right">
        <router-link to="/adminpanel" class="login-button">Sign In</router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      logoSrc: '/images/logo.png'
    };
  }
};
</script>

<style scoped>
.navbar {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-top: -20px;
  margin-bottom: -20px;
}

.logo {
  max-height: 120px;
  max-width: 100%;
}

.nav-right {
  display: flex;
  align-items: center;
}

.login-button {
  background-color: #c42326;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #a31d1f;
  color: white;
  text-decoration: none;
}
</style>

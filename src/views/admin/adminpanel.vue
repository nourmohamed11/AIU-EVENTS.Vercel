<template>
  <div>
    <HeaderComponent />

    <!-- About Us Section -->
    <div class="About-Us">
      <div class="inner-lay">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-6 col-md-4 mb-3">
              
              <!-- Login Form -->
              <div v-if="!isAuthenticated" class="login-form">
                <h2>Sign In</h2>
                <form @submit.prevent="handleLogin">
                  <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" v-model="username" id="username" required />
                  </div>
                  <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" v-model="password" id="password" required />
                  </div>
                  <button type="submit" class="custom-btn login-btn">Sign In</button>
                </form>
                <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
              </div>

              <!-- Navigation Buttons -->
              <div v-if="isAuthenticated">
                <button class="custom-btn btn-lg btn-block" @click="goTo('events')">Manage Events</button>
                <button class="custom-btn logout-btn" @click="logout">Sign Out</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../../../public/global/headerComponent.vue';
import FooterComponent from '../../../public/global/footerComponent.vue';

export default {
  name: 'AdminPanel',
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      isAuthenticated: false,
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  mounted() {
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      this.isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    },
    handleLogin() {
      if (this.username === 'admin' && this.password === 'admin') {
        this.isAuthenticated = true;
        this.errorMessage = '';
        sessionStorage.setItem('isAuthenticated', 'true');
      } else {
        this.errorMessage = 'Invalid username or password!';
      }
    },
    goTo(page) {
      this.$router.push(`/adminpanel/${page}`);
    },
    logout() {
      this.isAuthenticated = false;
      sessionStorage.removeItem('isAuthenticated');
    },
  },
};
</script>

<style scoped>
/* Add your CSS styles here */
.login-form {
  max-width: 400px;
  margin: 0 auto; /* Center the form horizontally */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #c42326; /* Same background color as the button */
  color: white; /* Same text color as the button */
}

/* Style the form input fields */
.login-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* Button Styles */
.custom-btn {
  background-color: #c42326 !important;
  color: white !important;
  border: 2px solid #ffffff; /* Add white border */
  padding: 10px;
  transition: background-color 0.3s, border-color 0.3s; /* Transition for border color */
  text-align: center;
  display: block;
  width: 100%;
  margin-bottom: 10px;
}

.custom-btn:hover {
  background-color: #ffffff; /* Change background on hover */
  color: #c42326; /* Change text color on hover */
  border-color: #c42326; /* Change border color on hover */
}

.error {
  color: white;
}

.title-color {
  color: #c42326; /* Change the title color */
}

.status-box {
  background-color: white; /* White background for eligibility status */
  border: 1px solid #ccc; /* Light gray border */
  padding: 15px; /* Padding around the content */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  color: black; /* Black text for better contrast */
}
</style>

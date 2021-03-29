<template>
  <div class="login container-fluid">
    <div class="row">
      <div class="col-md-6 col-sm-12 sidenav">
        <div class="logo-gradient">
          <img class="logo" src="../assets/github-logo.svg" alt="" />
        </div>
      </div>

      <div class="col-md-6 col-sm-12 bg-light">
        <div class="login-form">
          <p class="title"><strong>Login Via Email</strong></p>
          <b-form @submit="login">
            <b-form-group
              id="input-group-1"
              label="Email address"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter Email"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Password"
              label-for="input-2"
              :state="state"
              :invalid-feedback="invalidFeedback"
              required
            >
              <b-form-input
                id="input-2"
                type="password"
                v-model="form.password"
                required
              ></b-form-input>
            </b-form-group>

            <b-button type="submit" class="btn-login btn">Submit</b-button>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loginFailed: false,
    };
  },
  methods: {
    login: function (e) {
      e.preventDefault();
      console.log(this.form);
      if (this.form.email !== "" && this.form.password !== "") {
        axios.post(`http://0.0.0.0:${process.env.PORT}/login`, this.form).then((result) => {
          console.log(`result`, result);
          if (result.data.token) {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("userType", result.data.userType);
            if (result.data.userType == "ADMIN") {
              this.$router.push("/dashboard");
            } else {
              this.$router.push({
                name: "profile",
                params: { email: result.data.email },
              });
            }
          } else {
            this.loginFailed = true;
          }
        });
      } else {
        console.log("Please enter email & password");
      }
    },
  },
  computed: {
    state() {
      return !this.loginFailed;
    },
    invalidFeedback() {
      console.log(`this.loginFailed`, this.loginFailed);
      if (this.loginFailed) {
        return "Incorrect email or password";
      } else {
        return "";
      }
    },
  },
};
</script>

<style>
body {
  font-family: "Lato", sans-serif;
}

.sidenav {
  background-image: linear-gradient(
    to right bottom,
    #6fad3d,
    #40ba76,
    #00c3a9,
    #20c9d1,
    #67cbe9
  );
  overflow-x: hidden;
  padding-top: 20px;
}

.login-form {
  padding: 20%;
  /* padding-top: 40%; */
}

.btn-login {
  background-color: #00c3a9 !important;
  color: white !important;
  /* width: 20%; */
}

.title {
  font-size: 20px;
}

@media screen and (max-width: 450px) {
  .login-form {
    margin-top: 10%;
  }

  .sidenav {
    padding-top: 15px;
  }
}

@media screen and (min-width: 768px) {
  .main {
    margin-left: 40%;
  }

  .sidenav {
    width: 50%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
  }
}
</style>
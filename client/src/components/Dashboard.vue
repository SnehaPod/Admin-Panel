<template>
  <div class="dashboard">
    <div class="container-fluid mx-0">
      <div class="row">
        <div class="col-2 sidebar">
          <img
            src="../assets/github-logo.png"
            class="img-fluid"
            alt=""
            srcset=""
          />
          <p class="text-left mt-1 nav-item">Dashboard</p>
          <p class="text-left nav-item">Users</p>
          <p class="text-left nav-item">Admin Users</p>
          <p class="text-left nav-item">Whatsapp</p>

          <p class="text-left text-danger cursor-pointer" @click="logOut">
            Log Out
          </p>
        </div>
        <div class="col-10 px-3 bg-light">
          <!-- Add User button -->
          <div>
            <b-button class="float-right my-3" v-b-modal.add_user
              >Add User</b-button
            >
          </div>
          <!--  -->

          <!-- Table of users -->
          <div class="table-users">
            <b-table striped hover :items="users"></b-table>
          </div>
          <!--  -->
        </div>
      </div>
    </div>

    <!-- Modal to add user -->
    <b-modal id="add_user" centered title="Add User" hide-footer="true">
      <div>
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.email"
              type="email"
              placeholder="Enter email"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Name:" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="form.name"
              placeholder="Enter name"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Mobile:" label-for="input-3">
            <b-form-input
              id="input-3"
              v-model="form.mobile"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-4"
            label="Username:"
            label-for="input-4"
          >
            <b-form-input
              id="input-4"
              v-model="form.userName"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-5"
            label="Password:"
            label-for="input-5"
          >
            <b-form-input
              id="input-5"
              type="password"
              v-model="form.password"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-6"
            label="Confirm Password:"
            label-for="input-6"
          >
            <b-form-input
              id="input-6"
              type="password"
              v-model="form.confirmedPassword"
              required
            ></b-form-input>

            <b-form-invalid-feedback :state="validation">
              Your passwords don't match.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validation">
              Passwords match.
            </b-form-valid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-7"
            label="User Type:"
            label-for="input-7"
          >
            <b-form-select
              id="input-7"
              v-model="form.userType"
              :options="[
                { text: 'Admin', value: 'ADMIN' },
                { text: 'User', value: 'USER' },
              ]"
            ></b-form-select>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>

      <!--  -->
    </b-modal>
    <!--  -->
  </div>
</template>

<script>
import axios from "axios";
const BASE_API = process.env.NODE_ENV === 'production' ? 'https://admin-panel-vue.herokuapp.com/' : 'http://localhost:8085/';
export default {
  name: "Dashboard",
  data() {
    return {
      users: [],
      form: {
        name: "",
        mobile: "",
        email: "",
        password: "",
        confirmedPassword: "",
        userType: "",
        userName: "",
        mentees: "-",
      },
      isUserAdmin: localStorage.getItem("userType") == "ADMIN" ? true : false,
    };
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.getUsers();
    } else {
      this.$router.go(-1);
    }
  },
  methods: {
    getUsers: function () {
      axios
        // .get(`http://0.0.0.0:${process.env.PORT}/api/users`, {
        .get(`${BASE_API}/api/users`, {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        })
        .then((users) => {
          this.users = [];
          users.data.forEach((user, index) => {
            user["#"] = index + 1;
            var userObj = {
              "#": index + 1,
              name: user.name,
              mobile: user.mobile,
              email: user.email,
              userName: user.userName,
              userType: user.userType,
              mentees: user.mentees
            };
            this.users.push(userObj);
          });
        })
        .catch((err) => {
          console.log(`err`, err);
          this.$router.go(-1);
        });
    },
    onReset: function () {
      this.form = {
        name: "",
        mobile: "",
        email: "",
        password: "",
        confirmedPassword: "",
        userType: "",
        userName: "",
        mentees: "-",
      };
    },
    onSubmit: function (e) {
      e.preventDefault();
      axios
        // .post(`http://0.0.0.0:${process.env.PORT}/api/adduser`, this.form, {
        .post(`${BASE_API}/api/adduser`, this.form, {
          headers: {
            "Content-type": "application/json",
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        })
        .then((result) => {
          console.log(`result`, result);
          this.onReset();
          this.$bvModal.hide("add_user");
          this.getUsers();
        });
    },
    logOut: function () {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      this.$router.go(-1);
    },
  },
  computed: {
    validation() {
      return this.form.password === this.form.confirmedPassword;
    },
  },
};
</script>

<style scoped>
.sidebar {
  /* border: 1px solid; */
  box-shadow: 3px 0px #eeeded;
  height: 100vh;
}

p.nav-item {
  border-bottom: 2px solid #eeeded;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
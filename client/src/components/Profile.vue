<template>
  <div class="profile">
    <b-navbar toggleable="lg" type="dark">
      <b-navbar-brand href="#">CareerNinja</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">{{ email }}</b-dropdown-item>
            <b-dropdown-item @click="logOut">Log Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      email: this.$route.params.email,
    };
  },
  mounted() {
    console.log(`this.$route.params.email`, this.$route);
  },
  methods: {
    logOut: function () {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.sidebar {
  box-shadow: 3px 0px #eeeded;
  height: 100vh;
}

p.nav-item {
  border-bottom: 2px solid #eeeded;
}

.cursor-pointer {
  cursor: pointer;
}

.navbar {
  background-image: linear-gradient(
    to right bottom,
    #6fad3d,
    #40ba76,
    #00c3a9,
    #20c9d1,
    #67cbe9
  );
}
</style>
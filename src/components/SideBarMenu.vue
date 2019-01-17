<template>
  <div class="wrapper">
    <!-- Sidebar  -->
    <nav id="sidebar">
      <ul class="list-unstyled components">
        <li>
          <a href="/">
            <i class="fas fa-list"></i>
            Catalogs
          </a>
        </li>

        <li @click="navigate('orders')">
          <a>
            <i class="fas fa-archive"></i>
            Orders
          </a>
        </li>
        <li @click="navigate('featured')">
          <a>
            <font-awesome-icon icon="star"/>
            Featured Posts
          </a>
        </li>
        <li>
          <a href="#">
            <i class="fas fa-cog"></i>
            Store Settings
          </a>
        </li>
        <li @click="navigate('adminsetting')">
          <a>
            <i class="fas fa-users"></i>
            User Settings
          </a>
        </li>
        <li @click="navigate('tarrifsetting')">
          <a>
            <i class="fa fa-plane"></i>
            Tarrifs Setting
          </a>
        </li>
      </ul>
    </nav>
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: 'sidebar',
  components: {},
  methods: {
    navigate(path) {
      this.$router.push({ path: `/${path}` });
    },
  },
};
</script>

<style>
/*
    DEMO STYLE
*/

@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";
body {
  font-family: "Poppins", sans-serif;
  background: #fafafa;
}

p {
  font-family: "Poppins", sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}

.navbar {
  padding: 15px 10px;
  background: #fff;
  border: none;
  border-radius: 0;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
  box-shadow: none;
  outline: none !important;
  border: none;
}

.line {
  width: 100%;
  height: 1px;
  border-bottom: 1px dashed #ddd;
  margin: 40px 0;
}

i,
span {
  display: inline-block;
}

/* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */

.wrapper {
  display: flex;
  align-items: stretch;
}

#sidebar {
  min-width: 250px;
  max-width: 250px;
  background: #343a40;
  color: #fff;
  transition: all 0.3s;
  min-height: 1300px;
}

#sidebar.active {
  min-width: 80px;
  max-width: 80px;
  text-align: center;
}

#sidebar.active .sidebar-header h3,
#sidebar.active .CTAs {
  display: none;
}

#sidebar.active .sidebar-header strong {
  display: block;
}

#sidebar ul li a {
  text-align: left;
}

#sidebar.active ul li a {
  padding: 20px 10px;
  text-align: center;
  font-size: 0.85em;
}

#sidebar.active ul li a i {
  margin-right: 0;
  display: block;
  font-size: 1.8em;
  margin-bottom: 5px;
}

#sidebar.active ul ul a {
  padding: 10px !important;
}

#sidebar.active .dropdown-toggle::after {
  top: auto;
  bottom: 10px;
  right: 50%;
  -webkit-transform: translateX(50%);
  -ms-transform: translateX(50%);
  transform: translateX(50%);
}

#sidebar .sidebar-header {
  padding: 20px;
  background: white;
}

#sidebar .sidebar-header strong {
  display: none;
  font-size: 1.8em;
}

#sidebar ul.components {
  border-bottom: 1px solid white;
}

#sidebar ul li a {
  padding: 10px;
  font-size: 1.1em;
  display: block;
  color: white;
}

#sidebar ul li a:hover {
  color: black;
  background: #fff;
}

#sidebar ul li a i {
  margin-right: 10px;
}

#sidebar ul li.active > a,
a[aria-expanded="true"] {
  color: black;
  background: whitesmoke;
}

a[data-toggle="collapse"] {
  position: relative;
}

.dropdown-toggle::after {
  display: block;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: #6d7fcc;
}

ul.CTAs {
  padding: 20px;
}

ul.CTAs a {
  text-align: center;
  font-size: 0.9em !important;
  display: block;
  border-radius: 5px;
  margin-bottom: 5px;
}

/* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */

#content {
  width: 100%;
  padding: 20px;
  min-height: 100vh;
  transition: all 0.3s;
}

/* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */

@media (max-width: 768px) {
  #sidebar {
    min-width: 80px;
    max-width: 80px;
    text-align: center;
    margin-left: -80px !important;
  }
  .dropdown-toggle::after {
    top: auto;
    bottom: 10px;
    right: 50%;
    -webkit-transform: translateX(50%);
    -ms-transform: translateX(50%);
    transform: translateX(50%);
  }
  #sidebar.active {
    margin-left: 0 !important;
  }
  #sidebar .sidebar-header h3,
  #sidebar .CTAs {
    display: none;
  }
  #sidebar .sidebar-header strong {
    display: block;
  }
  #sidebar ul li a {
    padding: 20px 10px;
  }
  #sidebar ul li a span {
    font-size: 0.85em;
  }
  #sidebar ul li a i {
    margin-right: 0;
    display: block;
  }
  #sidebar ul ul a {
    padding: 10px !important;
  }
  #sidebar ul li a i {
    font-size: 1.3em;
  }
  #sidebar {
    margin-left: 0;
  }
  #sidebarCollapse span {
    display: none;
  }
}
</style>

<script setup>
import Navbar from './components/Navbar.vue'
import MainFooter from './components/MainFooter.vue'
</script>

<template>
  <Navbar />
  <router-view />
  <MainFooter />
</template>

  <style>
  /* Gaya global yang tersisa */
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    line-height: 1.5;
    background-color: #00BFFF; /* Background global */
    color: rgba(255, 255, 255, 0.87); /* Warna teks global default */
    overflow-x: hidden; /* Mencegah scroll horizontal */
  };

  #app {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  </style>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title class="text-center">Smart Spend</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <router-view />

      <q-footer elevated>
        <q-tabs>
          <q-route-tab to="/" icon="home" label="Home" />
          <q-route-tab to="/history" icon="history" label="History" />
          <q-route-tab to="/settings" icon="settings" label="Settings" />
        </q-tabs>
      </q-footer>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

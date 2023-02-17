<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <q-avatar>
              <img src="/icon.png" />
            </q-avatar>
            Spend Smart
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <router-view class="q-px-sm" />

      <q-footer elevated>
        <q-tabs>
          <q-route-tab to="/" icon="home" label="Home" />
          <q-route-tab to="/history" icon="history" label="History" />
          <q-route-tab
            to="/converter"
            icon="currency_exchange"
            label="Converter"
          />
          <q-route-tab to="/settings" icon="settings" label="Settings" />
        </q-tabs>
      </q-footer>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

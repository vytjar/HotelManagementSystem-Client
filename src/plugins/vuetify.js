/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'; // Import VCalendar explicitly

const blue = {
  dark: false, // Use dark: true for a dark theme
  themes: {
    light: {
      primary: '#1565C0', // Deep Blue
      secondary: '#42A5F5', // Light Blue
      accent: '#1E88E5', // Bright Blue Accent
      background: '#F5F5F5', // Light Gray Background
      surface: '#FFFFFF', // White Surface
      error: '#E57373', // Soft Red for Errors
      warning: '#FFB74D', // Amber for Warnings
      info: '#64B5F6', // Sky Blue for Info
      success: '#81C784', // Light Green for Success
    },
    dark: {
      primary: '#1E88E5', // Bright Blue for Dark Mode
      secondary: '#1565C0', // Deep Blue Accent
      background: '#121212', // Almost Black Background
      surface: '#1E1E1E', // Dark Surface
      error: '#EF5350', // Brighter Red for Errors
      warning: '#FFCA28', // Brighter Amber
      info: '#29B6F6', // Cyan Info
      success: '#66BB6A', // Mid-Green Success
    },
  }
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light', // Default to the light theme
    themes: {
      light: {
        colors: {
          primary: '#1976D2', // Muted Blue
          secondary: '#FF7043', // Soft Coral
          accent: '#009688', // Vibrant Teal
          error: '#D32F2F', // Subtle Red
          info: '#0288D1', // Calm Sky Blue
          success: '#388E3C', // Fresh Green
          warning: '#FFA000', // Soft Amber
          background: '#FAFAFA', // Warm White
          surface: '#FFFFFF', // Light Gray
          menu: '#ECEFF1', // Light Blue-Gray for menu background
        },
      },
      // dark: {
      //   colors: {
      //     primary: '#1E88E5', // Deep Blue-Gray
      //     secondary: '#FF7043', // Warm Orange
      //     accent: '#26A69A', // Vibrant Teal
      //     error: '#E53935', // Bold Red
      //     info: '#29B6F6', // Sky Blue
      //     success: '#43A047', // Soft Green
      //     warning: '#FFB300', // Warm Amber
      //     background: '#121212', // Soft Charcoal Gray
      //     surface: '#1E1E1E', // Medium Dark Gray
      //   },
      // },
      midnight: { // New theme between dark and light
        colors: {
          background: '#2a2e37', // Deep grey-blue background
          surface: '#3a3f4b', // Slightly lighter for card surfaces
          primary: '#4f8edc', // Softer blue accent
          secondary: '#8391a9', // Muted secondary color
          accent: '#7fbdf6', // Lighter accent blue
          error: '#e57373',
          info: '#4db6e3',
          success: '#60d394',
          warning: '#f8c471',
        },
      },
      test: {
        colors: {
          primary: '#546E7A', // Blue-Gray
          secondary: '#FFC107', // Soft Amber
          accent: '#00BCD4', // Cool Cyan
          error: '#E53935', // Deep Red
          info: '#29B6F6', // Sky Blue
          success: '#43A047', // Earthy Green
          warning: '#FFB300', // Golden Orange
          background: '#263238', // Slate Gray
          surface: '#37474F', // Medium Dark Gray
        },
      }
    },
  },
});

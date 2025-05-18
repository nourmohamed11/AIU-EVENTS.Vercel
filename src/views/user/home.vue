<template>
  <div class="modern-home">
    <HeaderComponent />
    <div class="calendar-container">
      <div class="calendar-header">
        <h2>Events Calendar</h2>
        <p class="subtitle">Alamein International University</p>
      </div>

      <!-- Calendar Component -->
      <div class="calendar-wrapper">
        <FullCalendar
          ref="calendar"
          :options="calendarOptions"
          @dateClick="handleDateClick"
          @eventClick="handleEventClick"
        />
      </div>

      <!-- Event Details Modal -->
      <div v-if="selectedEvent" class="modal-overlay" v-show="showModal">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ selectedEvent.title }}
            </h3>
            <button @click="closeModal" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="event-details">
              <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{{ selectedEvent.start }}</span>
              </div>
              <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{{ selectedEvent.description }}</span>
              </div>
            </div>
            
            <!-- Registration Form -->
            <div class="registration-form">
              <h4>Register for this Event</h4>
              <form @submit.prevent="handleRegistration">
                <div class="form-group">
                  <label for="studentId">Student ID</label>
                  <input 
                    type="text" 
                    id="studentId" 
                    v-model="registrationId"
                    required
                    placeholder="Enter your student ID"
                  />
                </div>
                <div v-if="registrationMessage" :class="['notification', registrationSuccess ? 'success' : 'error']">
                  {{ registrationMessage }}
                </div>
                <div class="button-group">
                  <button type="submit" class="register-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    Register
                  </button>
                </div>
              </form>
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
import FullCalendar from '@fullcalendar/vue3'; // Updated for Vue 3
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  name: 'ElectionCalendar',
  components: {
    HeaderComponent,
    FooterComponent,
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: [], // Events will be populated from the database
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        },
        locale: 'en', // English locale
        direction: 'ltr', // Left-to-right layout
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        height: 'auto', // Make calendar height responsive
        contentHeight: 'auto',
        aspectRatio: 1.5, // Adjust aspect ratio for better responsiveness
        eventContent: this.renderEventContent, // Custom event content renderer
      },
      selectedEvent: null, // Selected event for modal
      registrationId: '', // Student ID for registration
      registrationMessage: '', // Message to show after registration attempt
      registrationSuccess: false, // Whether registration was successful
      showModal: false, // Control modal visibility
    };
  },
  mounted() {
    this.fetchEvents(); // Fetch events when the component is mounted
  },
  methods: {
    // Fetch events from the database
    async fetchEvents() {
      try {
        const response = await fetch('https://aiu-events-backend.vercel.app/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const events = await response.json();

        // Map events to FullCalendar's expected format
        this.calendarOptions.events = events.map(event => ({
          id: event._id,
          title: event.eventName,
          start: event.eventDate,
          extendedProps: {
            description: event.eventDescription,
            participants: event.participants
          },
        }));
      } catch (error) {
        console.error('Error fetching events:', error);
        this.showNotification('Failed to load events', 'error');
      }
    },

    // Handle date click (e.g., add a new event)
    handleDateClick(info) {
      alert(`Clicked on date: ${info.dateStr}`);
    },

    // Handle event click (show event details in a modal)
    handleEventClick(info) {
      this.selectedEvent = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start.toLocaleString(),
        description: info.event.extendedProps.description,
        participants: info.event.extendedProps.participants || [],
      };
      this.registrationId = '';
      this.registrationMessage = '';
      this.showModal = true;
    },

    // Close modal
    closeModal() {
      this.showModal = false;
      this.selectedEvent = null;
    },

    // Handle event registration
    async handleRegistration() {
      if (!this.registrationId.trim()) {
        this.registrationMessage = 'Please enter your student ID';
        this.registrationSuccess = false;
        return;
      }

      try {
        // First, get student data
        const studentResponse = await fetch('https://aiu-events-backend.vercel.app/sdata');
        if (!studentResponse.ok) throw new Error('Failed to fetch student data');
        
        const students = await studentResponse.json();
        const student = students.find(s => s.student_id === this.registrationId.trim());
        
        if (!student) {
          this.registrationMessage = 'Student ID not Correct';
          this.registrationSuccess = false;
          return;
        }

        // Then, add participant to event
        const response = await fetch(
          `https://aiu-events-backend.vercel.app/events/${this.selectedEvent.id}/participants`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              studentId: student.student_id,
              name: student.student_name,
              major: student.student_faculty
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to register for the event');
        }

        const data = await response.json();
        this.registrationMessage = 'Successfully registered for the event!';
        this.registrationSuccess = true;
        
        // Update the event's participants list
        this.selectedEvent.participants = data.event.participants;
        
        // Refresh the events list
        this.fetchEvents();
      } catch (error) {
        console.error('Error registering for event:', error);
        this.registrationMessage = error.message || 'An error occurred while registering. Please try again.';
        this.registrationSuccess = false;
      }
    },

    showNotification(message, type = 'success') {
      this.notificationMessage = message;
      this.notificationType = type;
      setTimeout(() => {
        this.notificationMessage = '';
      }, 3000);
    },

    // Custom event content renderer
    renderEventContent(eventInfo) {
      return {
        html: `<div class="event-title">${eventInfo.event.title}</div>`, // Add a class for styling
      };
    },

    async exportToExcel() {
      if (!this.selectedEvent) return;
      
      try {
        const response = await fetch(
          `https://aiu-events-backend.vercel.app/events/${this.selectedEvent.id}/export`
        );
        
        if (!response.ok) throw new Error('Failed to export participants');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.selectedEvent.title}_participants.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Participants exported successfully');
      } catch (error) {
        console.error('Error exporting participants:', error);
        this.showNotification('Failed to export participants', 'error');
      }
    },
  },
};
</script>

<style scoped>
.modern-home {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.calendar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.calendar-header {
  text-align: center;
  margin-bottom: 2rem;
}

.calendar-header h2 {
  color: #0f106c;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.calendar-wrapper {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Calendar Styling */
:deep(.fc) {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:deep(.fc-header-toolbar) {
  margin-bottom: 1.5rem !important;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem !important;
  color: #0f106c;
}

:deep(.fc-button-primary) {
  background-color: #0f106c !important;
  border-color: #0f106c !important;
}

:deep(.fc-button-primary:hover) {
  background-color: #0c0d5a !important;
  border-color: #0c0d5a !important;
}

:deep(.fc-daygrid-event) {
  background-color: #0f106c !important;
  border-color: #0f106c !important;
  padding: 4px 8px;
  border-radius: 4px;
}

:deep(.event-title) {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  color: #0f106c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #f1f3f5;
}

.modal-body {
  padding: 1.5rem;
}

.event-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #555;
}

.participants-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.participants-section h4 {
  color: #0f106c;
  margin-bottom: 1rem;
}

.participants-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  font-size: 0.9rem;
}

.registration-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.registration-form h4 {
  color: #0f106c;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.form-group input:focus {
  outline: none;
  border-color: #0f106c;
  box-shadow: 0 0 0 3px rgba(15, 16, 108, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.register-btn {
  flex: 1;
}

.export-btn {
  flex: 1;
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notification {
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.notification.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.notification.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .calendar-container {
    padding: 1rem;
  }

  .calendar-header h2 {
    font-size: 1.5rem;
  }

  .calendar-wrapper {
    padding: 1rem;
  }

  .modal-container {
    margin: 1rem;
    max-height: 90vh;
  }

  .participants-list {
    grid-template-columns: 1fr;
  }
}
</style>
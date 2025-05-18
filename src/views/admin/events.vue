<template>
  <div class="modern-admin">
    <HeaderComponent />

    <!-- Notification Section -->
    <div v-if="notification.message" class="notification-box">
      <div :class="['notification', notification.type]">
        {{ notification.message }}
      </div>
    </div>

    <div class="admin-container">
      <div class="admin-header">
        <h1 class="page-title">Events Management</h1>
        <p class="page-subtitle">Alamein International University</p>
      </div>

      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Events Management Section -->
        <div class="registrations-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Events Table
            </h3>
            
            <!-- Add Event Button -->
            <button @click="openAddEventModal" class="add-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New Event
            </button>
          </div>

              <!-- Filters -->
          <div class="filters">
            <div class="filter-group">
              <label for="filter-event-name" class="filter-label">Event Name</label>
                <input
                  type="text"
                  v-model="filterEventName"
                id="filter-event-name"
                class="filter-input"
                  placeholder="Search by event name"
                />
            </div>
            
            <div class="filter-group">
              <label for="filter-event-date" class="filter-label">Date</label>
                <input
                  type="date"
                  v-model="filterEventDate"
                id="filter-event-date"
                class="filter-input"
                />
              </div>

            <button @click="resetFilters" class="reset-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
              Reset
            </button>
          </div>

          <!-- Month Selector -->
          <div class="month-selector">
            <button @click="previousMonth" class="month-nav-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h3 class="current-month">{{ currentMonthDisplay }}</h3>
            <button @click="nextMonth" class="month-nav-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <button @click="goToToday" class="today-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Today
              </button>
          </div>

              <!-- Events Table -->
          <div class="table-container">
            <table class="registrations-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Participants</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                <tr v-for="event in currentMonthEvents" :key="event._id">
                    <td>{{ event.eventName }}</td>
                    <td>{{ event.eventDescription }}</td>
                    <td>{{ formatDate(event.eventDate) }}</td>
                    <td>
                    <button @click="openParticipantsModal(event)" class="view-participants-btn">
                      View Participants ({{ event.participants.length }})
                    </button>
                    </td>
                  <td class="actions-col">
                    <button @click="editEvent(event)" class="edit-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                        Edit
                      </button>
                    <button @click="deleteEvent(event)" class="delete-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          <div v-if="currentMonthEvents.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No events found</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Event Modal -->
      <div v-if="showEventModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ isEditing ? "Edit Event" : "Add New Event" }}
            </h3>
            <button @click="closeEventModal" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="saveEvent">
              <div class="form-group">
                <label for="eventName">Event Name</label>
                <input
                  type="text"
                  v-model="currentEvent.eventName"
                  id="eventName"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="eventDescription">Description</label>
                <textarea
                  v-model="currentEvent.eventDescription"
                  id="eventDescription"
                  class="form-control"
                  required
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="eventDate">Date and Time</label>
                <input
                  type="datetime-local"
                  v-model="currentEvent.eventDate"
                  id="eventDate"
                  class="form-control"
                  required
                />
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button @click="closeEventModal" class="cancel-btn">Cancel</button>
            <button @click="saveEvent" class="save-btn">
              <span v-if="loading" class="spinner"></span>
              <span v-else>{{ isEditing ? "Save Changes" : "Add Event" }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Participants Management Modal -->
      <div v-if="showParticipantsModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Participants Management - {{ selectedEvent?.eventName }}
            </h3>
            <button @click="closeParticipantsModal" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <!-- Add Participant Section -->
            <div class="add-participant-section">
              <div class="participants-input">
                <input
                  type="text"
                  v-model="newParticipant.studentId"
                  class="form-control"
                  placeholder="Enter Student ID"
                />
                <button
                  type="button"
                  @click="addParticipant"
                  class="add-participant-btn"
                >
                  Add Participant
                </button>
              </div>
            </div>

            <!-- Participants Table -->
            <div class="participants-table-container">
              <table class="participants-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Faculty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(participant, index) in selectedEvent?.participants" :key="index">
                    <td>{{ participant.studentId }}</td>
                    <td>{{ participant.name }}</td>
                    <td>{{ participant.major }}</td>
                    <td>
                    <button
                      type="button"
                      @click="removeParticipant(index)"
                        class="remove-participant-btn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="exportParticipants" class="export-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Data
            </button>
            <button @click="closeParticipantsModal" class="cancel-btn">Close</button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-container delete-modal">
          <div class="modal-header">
            <h3 class="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete Event
            </h3>
            <button @click="closeDeleteModal" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
                    </button>
          </div>
          
          <div class="modal-body">
            <div class="delete-confirmation">
              <p>Are you sure you want to delete the event "{{ eventToDelete?.eventName }}"?</p>
              <p class="warning-text">This action cannot be undone.</p>
            </div>
              </div>
          
          <div class="modal-footer">
            <button @click="closeDeleteModal" class="cancel-btn">Cancel</button>
            <button @click="confirmDelete" class="delete-confirm-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete Event
              </button>
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
  name: 'AdminPanelEvents',
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      isAuthenticated: false,
      events: [],
      filterEventName: '',
      filterEventDate: '',
      showEventModal: false,
      isEditing: false,
      currentEvent: {
        eventName: '',
        eventDescription: '',
        eventDate: '',
        participants: [],
      },
      newParticipant: {
        studentId: '',
        name: '',
        email: '',
        major: ''
      },
      notification: {
        message: '',
        type: '',
      },
      loading: false,
      isLoading: false,
      showParticipantsModal: false,
      selectedEvent: null,
      showDeleteModal: false,
      eventToDelete: null,
      currentDate: new Date(),
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter((event) => {
        return (
          (!this.filterEventName ||
            event.eventName
              .toLowerCase()
              .includes(this.filterEventName.toLowerCase())) &&
          (!this.filterEventDate ||
            new Date(event.eventDate).toISOString().split('T')[0] ===
              this.filterEventDate)
        );
      });
    },
    currentMonthDisplay() {
      return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    },
    currentMonthEvents() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      return this.filteredEvents.filter(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
      });
    },
  },
  mounted() {
    this.checkAuthentication();
    this.loadEvents();
  },
  methods: {
    checkAuthentication() {
      this.isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      if (!this.isAuthenticated) {
        this.$router.push('/adminpanel');
      }
    },
    async loadEvents() {
      this.isLoading = true;
      try {
        const response = await fetch('https://aiu-events-backend.vercel.app/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const events = await response.json();
        this.events = events;
      } catch (error) {
        console.error('Error loading events:', error);
        this.showNotification('Failed to load events', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    toggleParticipants(event) {
      event.showParticipants = !event.showParticipants;
    },
    openAddEventModal() {
      this.isEditing = false;
      this.currentEvent = {
        eventName: '',
        eventDescription: '',
        eventDate: '',
        participants: [],
      };
      this.showEventModal = true;
    },
    closeEventModal() {
      this.showEventModal = false;
    },
    async addParticipant() {
      if (this.newParticipant.studentId && this.selectedEvent) {
        try {
          const response = await fetch('https://aiu-events-backend.vercel.app/sdata');
          if (!response.ok) throw new Error('Failed to fetch student data');
          
          const students = await response.json();
          const student = students.find(s => s.student_id === this.newParticipant.studentId);
          
          if (!student) {
            throw new Error('Student not found');
          }

          const participantResponse = await fetch(
            `https://aiu-events-backend.vercel.app/events/${this.selectedEvent._id}/participants`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentId: student.student_id,
                name: student.student_name,
                major: student.student_faculty
              }),
            }
          );

          if (!participantResponse.ok) throw new Error('Failed to add participant');

          const updatedEvent = await participantResponse.json();
          this.selectedEvent = updatedEvent.event;
          
          // Update the event in the main list
          const eventIndex = this.events.findIndex(e => e._id === this.selectedEvent._id);
          if (eventIndex !== -1) {
            this.events[eventIndex] = { ...this.selectedEvent };
          }
          
          this.newParticipant.studentId = '';
          this.showNotification('Student added successfully');
        } catch (error) {
          console.error('Error adding participant:', error);
          this.showNotification('Participant is already Registered', 'error');
        }
      }
    },
    async removeParticipant(index) {
      if (this.selectedEvent) {
        try {
          const participant = this.selectedEvent.participants[index];
          const response = await fetch(
            `https://aiu-events-backend.vercel.app/events/${this.selectedEvent._id}/participants`,
            {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ studentId: participant.studentId }),
            }
          );

          if (!response.ok) throw new Error('Failed to remove participant');

          const updatedEvent = await response.json();
          this.selectedEvent = updatedEvent.event;
          
          // Update the event in the main list
          const eventIndex = this.events.findIndex(e => e._id === this.selectedEvent._id);
          if (eventIndex !== -1) {
            this.events[eventIndex] = { ...this.selectedEvent };
          }

          this.showNotification('Participant removed successfully');
        } catch (error) {
          console.error('Error removing participant:', error);
          this.showNotification('Failed to remove participant', 'error');
        }
      }
    },
    async saveEvent() {
      this.loading = true;
      try {
        const url = this.isEditing
          ? `https://aiu-events-backend.vercel.app/events/${this.currentEvent._id}`
          : 'https://aiu-events-backend.vercel.app/events';
        const method = this.isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: this.currentEvent.eventName,
            eventDescription: this.currentEvent.eventDescription,
            eventDate: this.currentEvent.eventDate
          }),
        });

        if (!response.ok) throw new Error('Failed to save event');

        this.showEventModal = false;
        this.loadEvents();
        this.showNotification(
          this.isEditing ? 'Event updated successfully' : 'Event added successfully'
        );
      } catch (error) {
        console.error('Error saving event:', error);
        this.showNotification('Failed to save event', 'error');
      } finally {
        this.loading = false;
      }
    },
    editEvent(event) {
      this.isEditing = true;
      this.currentEvent = {
        _id: event._id,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventDate: event.eventDate,
        participants: event.participants,
      };
      this.showEventModal = true;
    },
    deleteEvent(event) {
      this.eventToDelete = event;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.eventToDelete = null;
    },
    async confirmDelete() {
      if (!this.eventToDelete) return;
      
      try {
        const response = await fetch(`https://aiu-events-backend.vercel.app/events/${this.eventToDelete._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete event');

        this.events = this.events.filter((e) => e._id !== this.eventToDelete._id);
        this.showNotification('Event deleted successfully');
        this.closeDeleteModal();
      } catch (error) {
        console.error('Error deleting event:', error);
        this.showNotification('Failed to delete event', 'error');
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    resetFilters() {
      this.filterEventName = '';
      this.filterEventDate = '';
    },
    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      setTimeout(() => {
        this.notification.message = '';
      }, 3000);
    },
    openParticipantsModal(event) {
      this.selectedEvent = { ...event };
      this.showParticipantsModal = true;
    },
    closeParticipantsModal() {
      this.showParticipantsModal = false;
      this.selectedEvent = null;
      this.newParticipant.studentId = '';
    },
    async exportParticipants() {
      if (!this.selectedEvent) return;
      
      try {
        const response = await fetch(
          `https://aiu-events-backend.vercel.app/events/${this.selectedEvent._id}/export`
        );
        
        if (!response.ok) throw new Error('Failed to export participants');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.selectedEvent.eventName}_participants.pdf`;
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
    previousMonth() {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      this.currentDate = newDate;
    },
    nextMonth() {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      this.currentDate = newDate;
    },
    goToToday() {
      this.currentDate = new Date();
    },
  },
};
</script>

<style scoped>
/* Modern Admin Styles */
.modern-admin {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-container {
  max-width: 1200px;
  width: 100%;
  height: calc(100vh - 140px); /* Adjust based on header/footer height */
  margin: 0 auto;
  padding: 1.5rem;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.admin-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e1e4e8;
}

.page-title {
  font-size: 2rem;
  color: #0f106c;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
}

/* Section Styles */
.registrations-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.25rem;
  color: #0f106c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Button Styles */
.add-btn {
  padding: 0.75rem 1.5rem;
  background-color: #0f106c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.add-btn:hover {
  background-color: #0c0d5a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Filters */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.filter-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  align-self: flex-end;
}

.reset-btn:hover {
  background-color: #5a6268;
}

/* Table Styles */
.table-container {
  flex: 1;
  overflow-y: auto;
  margin-top: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.registrations-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.registrations-table th {
  background-color: #f1f3f5;
  color: #333;
  padding: 0.75rem;
  text-align: left;
  font-weight: 500;
}

.registrations-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.registrations-table tr:hover {
  background-color: #f8f9fa;
}

/* Participants Table */
.participants-table-container {
  margin-top: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: auto;
  max-height: 300px;
}

.participants-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.participants-table th {
  background-color: #000;
  color: white;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
}

.participants-table thead {
  border-bottom: 2px solid #000;
}

.participants-table td {
  padding: 0.5rem;
  border-top: 1px solid #eee;
}

.view-participants-btn {
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.3s ease;
}

.view-participants-btn:hover {
  background-color: #dee2e6;
}

/* Action Buttons */
.actions-col {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.edit-btn {
  background-color: #ffc107;
  color: #212529;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* Modal Styles */
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
  padding: 1rem;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

/* Form Styles */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.form-control:focus {
  outline: none;
  border-color: #0f106c;
  box-shadow: 0 0 0 3px rgba(15, 16, 108, 0.1);
}

/* Participants Input */
.participants-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.add-participant-btn {
  padding: 0.5rem 1rem;
  background-color: #0f106c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.remove-participant-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: #666;
}

.empty-state svg {
  color: #999;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0f106c;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Notification */
.notification-box {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1100;
}

.notification {
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s, fadeOut 0.5s 2.5s forwards;
}

.notification.success {
  background-color: #28a745;
}

.notification.error {
  background-color: #dc3545;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    min-width: 100%;
  }
  
  .registrations-table {
    font-size: 0.8rem;
  }
  
  .registrations-table th, 
  .registrations-table td {
    padding: 0.5rem;
  }
  
  .edit-btn, 
  .delete-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
  
  .modal-container {
    max-height: 80vh;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
  }
}

/* Participants Modal Specific Styles */
.add-participant-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.export-btn {
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.export-btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Delete Modal Styles */
.delete-modal {
  max-width: 500px;
  max-height: 400px;
}

.delete-confirmation {
  text-align: center;
  padding: 1rem;
}

.delete-confirmation p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
}

.delete-confirm-btn {
  padding: 0.75rem 1.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.delete-confirm-btn:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Month Selector Styles */
.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.current-month {
  font-size: 1.25rem;
  color: #0f106c;
  margin: 0;
  min-width: 200px;
  text-align: center;
}

.month-nav-btn {
  background: none;
  border: none;
  color: #0f106c;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-nav-btn:hover {
  background-color: #e9ecef;
  transform: scale(1.1);
}

.today-btn {
  padding: 0.5rem 1rem;
  background-color: #0f106c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.today-btn:hover {
  background-color: #0c0d5a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
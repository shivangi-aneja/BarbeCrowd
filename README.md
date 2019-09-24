# Software Engineering for Business Applications: BarbeCrowd


- ``app/`` contains the source code including backend and frontend. &rarr; [README](app/README.md)
- ``deliverables/`` contains the exercise deliverables which we have/had to submit to the SEBA team.

Some of the folders may have their own ``README``s.

## The structure of the application

### Login/SignUp
<p float="center">
  <img src="/screenshots/signup.png" width="100%" />
</p>

SignUp : User should first register with the application to use the features. The phone number and location are optional, functionality requiring this data could be added in the future.

<p float="center">
  <img src="/screenshots/login.png" width="100%" />
</p>
Login : After registering, the user can log into the application. The login token is valid for 24 hours. 

The team developed 4 use cases

### 1. Event Creation

<p float="center">
  <img src="/screenshots/event_creation.png" width="100%" />
</p>

HomeView : When the user logs in, they can see all the events that they created or accepted invitations to. Different colors are used for categorizing types of parties. When the user clicks on the Create Event button (shown on the right), they are prompted with a popup modal where they can enter all the event details about the barbeque party they want to create (next Screenshot). 
Users can also click on the EventCard to see all the event details.
<p float="center">
  <img src="/screenshots/event_create_popup.png" width="100%" />
</p>
Create Event Pop Up : When the user clicks on the Create Event button, a popup appears for creating an event. User then enters the details related to the event like event name, date, location and time. After submitting, an event with the specified name is created.
<p float="center">
  <img src="/screenshots/event_detail.png" width="100%" />
</p>
Event Detail Screen : When the user clicks on the Event Card, they are redirected to the event detail screen where they can see all the event related details. When the user clicks on Guest list, they can see the list of all invited users and the status of their invitation. 

<p float="center">
  <img src="/screenshots/guest_list.png" width="100%" />
</p>
Guest List Button : When the user clicks on the Guest List button, they can see all the members of the event with their corresponding invitation status (accepted, pending, rejected). 
Note : Users can only see the events to which they are invited to or they themselves created.


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
  <img src="/screenshots/guest_list.png"  />
</p>
Guest List Button : When the user clicks on the Guest List button, they can see all the members of the event with their corresponding invitation status (accepted, pending, rejected). 
Note : Users can only see the events to which they are invited to or they themselves created.

### 2.  Item Addition / Editing / Deletion

<p float="center">
  <img src="/screenshots/add_item.png" width="100%" />
</p>
Add Item : On the event detail screen, when the user clicks on the ‘Add Item’ button, a pop up appears, where the user can enter all the details related to the item (i.e. item name, amount and its category). When the user submits the item, it is added to the event and appears in the table. The item therefore represents the user’s request of an item that they wish to be brought to the event. The new item is sent to other members currently looking at the table in real-time and flashes briefly.
<p float="center">
  <img src="/screenshots/edit_item.png" width="100%" />
</p>
Edit Item: When the item is added to the table, it is not assigned to anyone initially. Only the user who added the item or a host can edit this item. The remaining users can only assign/unassign this item to themselves. Once an item was assigned it can not be edited by the requesting user anymore. This can be seen by visible ‘Action’ icons in the last column of the table. Updates are sent to other users in real-time and are highlighted visually by flashing briefly. If the item is edited by a host, requesting and assigned users of that items will be notified of the change by being sent a notification.
<p float="center">
  <img src="/screenshots/assign_item.png" width="100%" />
</p>
Assign Item: Users can assign an item to themselves, declaring their intent of bringing the item to the event. When a user clicks on the assign item icon, they are prompted with a popup to enter the estimated cost of the item. When the user enters the estimated cost, and clicks on the confirm button, a notification is sent to the user who created the item request. When an item is assigned to one user, other users can not assign the same item to themselves anymore. If an item was assigned to a user, the match is successful and the item’s background turns green. The requesting user will be notified that their item was assigned. The item update after the assignment is again sent in real-time to other members.
<p float="center">
  <img src="/screenshots/unassign_item.png" width="100%" />
</p>
Unassign Item: Similarly, when the user un-assigns the item (by clicking on unassign icon and then confirming it) the user who requested the item is notified again. Now this item is available to be assigned to anyone. 

<p float="center">
  <img src="/screenshots/delete_item.png" width="100%" />
</p>
Delete Item: Items can be deleted from the table by hosts or by their requesting users by clicking the trash can. Users will again receive a notification if their requested or assigned item is deleted. The table update is sent in real-time.
<p float="center">
  <img src="/screenshots/notification.png" width="100%" />
</p>

Notifications (First and Third from top) received by the user who requested the item. If the user himself adds the item and assigns it to himself, no notification is sent to anyone. Additionally: notifications for deleting and editing items if other users than the initiator are affected.

### 3.  Sending/Receiving Invitation

Currently, we have two roles : Host and Guests. Host users can invite other users as Host or Guest. Guests can join the event, but can not invite other users. The user who creates the event is implicitly assigned the role host.

<p float="center">
  <img src="/screenshots/invite.png" width="100%" />
</p>
<p float="center">
  <img src="/screenshots/invite_notify.png"  />
</p>
Sending Invitation : On the event detail screen, when the user clicks on Invite Guest button, then a pop up appears wherein details of the invited user are to be filled (his email id, message, and his role). And then when the user clicks on Send Invite button, an invitation is sent to the invited user and the invited user is notified. The notification updates in real time. 

<p float="center">
  <img src="/screenshots/receive_notify.png"  />
</p>

Receiving Invitation: Registered users receive the invitation as notification in the inbox icon. When the user clicks on the invitation, they are redirected to another screen where they can see event details and then accept/decline the invitation.
<p float="center">
  <img src="/screenshots/accept_invite.png" width="100%" />
</p>
Accepting Invitation : User can accept or decline the invitation. When the user clicks on accept button he is added to the event and redirected to the HomeView. 
<p float="center">
  <img src="/screenshots/decline_invite.png" width="100%" />
</p>
Declining Invitation : When the user clicks on decline invitation, they are prompted if they actually want to decline the invitation. Their invitation is declined and they are redirected to the HomeView.

<p float="center">
  <img src="/screenshots/other_notify.png"  />
</p>
All the other users who have already accepted the invitation to this particular event will be notified via the bell icon when a new user joins the event. The users are notified in real time. Notifications for declining an event are not sent.

### 4.  Group Chat

<p float="center">
  <img src="/screenshots/chat.png"  />
</p>

Group Chat : The accepted users of an event can chat with each other to discuss about the whereabouts of the party. The chat updates in real time and shows the user profile picture and timestamps as well. The chat widget is also always in the bottom right corner and sticks to that position while scrolling. This makes the chat always accessible which leads to a more effective communication.
<p float="center">
  <img src="/screenshots/chat2.png" width="100%"  />
</p>
The Event Page Overview with the Chat Widget and the list of the event items.
Each Event Page contains both components.

### 5.  Profile View

<p float="center">
  <img src="/screenshots/profile.png" width="100%"  />
</p>

Profile View : When the user clicks on “My Profile” from the profile dropdown in the header (as shown in screenshot), they are redirected to the profile view screen where they can upload the profile picture and view their personal details (i.e. their username, registered email, phone number and location).
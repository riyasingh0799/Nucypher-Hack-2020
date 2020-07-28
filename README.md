 ### NuCypher Location Proofs 

In the current scenario of a worldwide pandemic, it is crucial for the infection to be contained by self-quarantine, especially when a person has come in contact with another person prior to or after their being tested positive for Covid-19. However, it is not easy for a govt officer, say, from the Health Department, to check if a suspected carrier of the disease is staying in quarantine. At the same time, it is important for the user's private data to remain secure. 

I have created this app to help the trusted govt institutions verify that a suspected Covid-19 carrying person is staying at their primary location (home, or some hospital, testing facility, etc). The app will allow the user to share his/her present location securely with the trusted institution, without it falling into the wrong hands. Thus, the personal data and the primary location of a quarantined person will remain private.
At the time of registry, a unique ID and the GPS coordinates of their primary location are stored for a person. The trusted govt institution/official can then check if the person is within 10 m of the primary location till the end of the quarantine period. If the user fails to respond for a long time or refuses to give his/her coordinates, appropriate measures can be taken.

### Working of the App

1.) A new account is created for a suspected Covid-19 carrier by a trusted party.  
2.) A govt officer or some other trusted individual queries the current location.  
3.) The user can grant access to their current location to the officer.  
4.) The current GPS coordinates are encrypted and an encrypting key and secret are shared with the trusted officer.  
5.) The officer can then decrypt the secret to obtain the current location.  
6.) The app outputs if the distance between the primary and current location is less than 10m.  
7.) No one can request user's current location after the end of 14 days since the creation of the patient's entry.  

### Demo video

https://youtu.be/71XbvPJ5eig

### Deployment Steps
Before deploying, execute nucypher ursula run --dev --federated-only in virtual environment. Execute 'nucypher alice run --dev --federated-only --teacher 127.0.0.1:10151' and 'nucypher bob run --dev --federated-only --teacher 127.0.0.1:10151 --controller-port 4000' in separate terminals.

1.) Clone this repository.  
2.) In the api and the client folders, install the required dependencies with npm i  
3.) Start the server by executing cd api && node server.js  
4.) Start client app with the command cd client && yarn start  
5.) The app is running at the port 3001  

### License 
This project is licensed under the terms of MIT License.

[![adopt-meow-banner.png](https://i.postimg.cc/MTYNp3xq/adopt-meow-banner.png)](https://postimg.cc/sQvwncvN)

"The English version of the description is provided below"

| índice    |
| --------- |
| [Descripción del Poyecto](#descripción-del-proyecto)  |
| [Características](#características)    |
| [Funcionalidad](#funcionalidad)    |
| [Tecnologías Utilizadas](#tecnologías-utilizadas)    |
| [Desarrolladores Contribuyentes](#desarrolladores-contribuyentes)     |

### Descripción del Proyecto:
El presente proyecto ha sido creado con el fin de aprendizaje del stack "Mobile". Se decidió crear un app móvil que aborde una problemática real y la necesidad de implementar un solución, utilizando las tecnologías que ya he madurado, e incorporando nuevas. Se optó por crear una aplicación que permita a los usuarios poder "anunciar" gatitos para su adopción, o localizar aquellos cercanos que han sido puestos para su adopción.

### Características:
La presente app móvil tiene 2 interfaces de visualización, ya que cuenta con 2 tipos de usuarios: 
- "OWNERS": Usuarios propietarios de gatitos que serán puestos en adopción.
- "ADOPTERS": Usuarios que desean adoptar gatitos.

La características principal, es que **ADOPT-MEow** impulsa la *conexión* entre los propietarios de gatitos que serán puestos en adopción, y aquellos adoptantes que deseen adoptar gatitos.
Mediante esta app, se intenta agilizar el *esfuerzo de adopción* por parte de los propietarios, y los adoptantes pueden visualizar de forma eficiente aquellos gatitos cercanos, su información, y su conexión para generar la adopción responsable.

### Funcionalidad:
#### Interfaz de Usuarios No Registrados
Luego de iniciar la aplicación, Se dispone una pantalla para el ingreso de los usuarios, con un formulario para ingresar, y si el usuario no tiene una cuenta creada, a través de un link, se redirecciona a la pantalla de registro de los nuevos usuarios, donde se debe seleccionar el tipo de usuario, y se deberá completar el formulario con los datos correspondientes.

[![initial-screens.png](https://i.postimg.cc/9XdNJxnc/initial-screens.png)](https://postimg.cc/yWNPNTKG)

#### Interfaz de OWNERS
Un usuario que desee anunciar un gatito en la app, luego de registrarse, se va a encontrar con las pantalla "Home Screen", que consta de 3 secciones:

- User Bar: Se muestra la foto y el nombre del usuario propietario de la cuenta, y además contiene el botón de "Salir" para cerrar la sesión.
- Botón de "Nuevo Gatito en Adopción": Este botón permite el desplazamiento hacia la pantalla donde se permite crear un nuevo reporte de un gatito en adopción.
- Listado de "Reportes": Se muestran los gatitos que han sido anunciados para su adopción, Cada gatito tiene un indicador de cantidad de interesados en su adopción, y el botón de "eliminar" en caso que se desestime su postulación para adopción.

De estas 3 secciones se desprenden otras pantallas:

- Reporte de Nuevo Gatito en Adopción: Esta pantalla está dedicada a la obtención de los datos del gatito, para luego mostrar estos datos a los usuarios "ADOPTERS". Se almacena la geolocalización al momento del registro, para luego mostrar su ubicación, además de una imagen del mismo, su nombre, edad, peso, cuidados especiales y una breve descripción.
- Selección del usuario "Adopter": al presionar un gatito del listado de reportes, aparecerá la pantalla con el listado de usuarios interesados en adoptar a ese gatito. Al costado derecho de cada ADOPTER que se postuló, está el botón de "ENTREGAR", por lo que el usuario "OWNER" deberá elegir el adoptante al que desee entregar el gatito, presionando este botón.
- Modal de Confirmación: Aparecerá luego de seleccionar el usuario "ADOPTER" al que se le entregará el gatito.

[![owners-interface.png](https://i.postimg.cc/nckmR7xs/owners-interface.png)](https://postimg.cc/svM11Mvy)


#### Interfaz de ADOPTERS
Un usuario que desee adoptar un gatito en la app, luego de registrarse, se va a encontrar con las pantalla "Home Screen", que consta de 3 secciones:

- User Bar: Se muestra la foto y el nombre del usuario propietario de la cuenta, y además contiene el botón de "Salir" para cerrar la sesión.
- Mapa de "Gatitos Cercanos": A través de un mapa provisto por react google maps, se podrán visualizar en componentes Avatar, las imágenes de los gatitos cercanos disponibles para su adopción.
- Botón de "Novedades": Se muestra un botón con un Badge indicando la cantidad de postulaciones a adopción del usuario.

De estas 3 secciones se desprenden otras pantallas:

- Pantalla de "Información del Gatito": Luego de presionar el avatar de algún gatito cercano en el mapa, aparecerá la pantalla que muestra todos los datos del gatito, provistos por el usuario "OWNER" y su nombre y fotografía. Además está el botón de "ADOPTAR" que al ser presionado aparecerá el siguiente Modal. 
- Modal de "Solicitud de Adopción Enviada": Este modal confirma que la postulación ha sido exitosa, y además informa que el usuario "OWNER" del gatito revisará la misma, pudiendo aceptar o rechazar la postulación.
- Pantalla de "Novedades": Aparecerá luego de presionar el botón de "Novedades", aquí se muestra el listado de postulaciones a la que aplicó el usuario, y el estado de las mismas, pudiendo ser "En revisión": El OWNER aún no decide a quién entregará el gatito, "Aprobada": El usuario ha sido elegido para la adopción, y "No Aprobada": El usuario no ha sido elegido para la adopción, o el gatito ya se entregó a otro usuario de tipo "ADOPTER".

[![adopters-interface.png](https://i.postimg.cc/ncR8GRXC/adopters-interface.png)](https://postimg.cc/XpCDVgcb)

#### Base de Datos
La aplicación ADOPT-MEow cuenta con su base de datos propia: https://adopt-meow-back-emd-production.up.railway.app/api
Esta base de datos fue desarrollada por el colaborador Miguel Ortiz. Él se encargó de desarrollar los end-points de acuerdo a las reglas de negocios propuestas para cada interfaz.

Además, se instaló la dependencia @react-native-async-storage/async-storage para almacenar localmente el objeto "user", y luego enviar el id del usuario logueado a la API, para la gestión de ciertas funcionalidades.

### Tecnologías Utilizadas
Las tecnologías utilizadas para el desarrollo de esta aplicación móvil fueron:
##### Lenguaje de Programación Base
- JavaScript 
- Framework de JavaScript: React Native
##### Tipado de Datos
- TypeScript
##### Navegación entre Pantallas
- React Navigation Native Stack
##### Estilos
- Componentes Nativos de React Native
- Tailwind Css
- Nativewind
- React Native Reanimated
##### Solicitudes HTTP a Api
- Axios
##### Manejo y Control del Estado Local
- React Native Async Storage
##### Mapas
- React Native Maps
- React Native Maps Clustering
- Expo location
##### Gestion de Versiones
- Git
### Desarrolladores Contribuyentes
##### Desarrollado por:
-Aplicación Móvil: Emmanuel Ortiz, Junior Front-End Developer.
https://www.linkedin.com/in/emmanuel-ortiz-745427273/
- Api: Miguel Ortiz, Junior Full-Stack Developer.
https://www.linkedin.com/in/miguel-ortiz-9736b32a5/
##### Code-Review a cargo de:
Fernando A. Gonzalez, Software Lead Engineer.
https://www.linkedin.com/in/fernando-a-gonzalez/

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

| Index |
| ------ |
| [Project Description](#project-description) |
| [Features](#features) |
| [Functionality](#functionality) |
| [Technologies Used](#technologies-used) |
| [Contributing Developers](#contributing-developers) |

### Project Description:
This project was created with the aim of learning the "Mobile" stack. It was decided to create a mobile app that addresses a real problem and the need to implement a solution, using the technologies I have already matured, and incorporating new ones. A mobile application was chosen to allow users to "announce" kittens for adoption or locate nearby kittens that have been put up for adoption.

### Features:
This mobile app has two user interfaces, as it has two types of users:
- "OWNERS": Users who own kittens that will be put up for adoption.
- "ADOPTERS": Users who want to adopt kittens.

The main feature is that **ADOPT-MEow** promotes the *connection* between the owners of kittens to be adopted and those who wish to adopt them. Through this app, the *adoption effort* by owners is streamlined, and adopters can efficiently view nearby kittens, their information, and connect for responsible adoption.

### Functionality:
#### Unregistered Users Interface
After launching the application, a screen for user login is provided, with a form to log in, and if the user does not have an account, a link redirects to the new user registration screen, where the type of user must be selected, and the form must be completed with the corresponding data.

[![initial-screens.png](https://i.postimg.cc/9XdNJxnc/initial-screens.png)](https://postimg.cc/yWNPNTKG)

#### OWNERS Interface
A user who wants to announce a kitten in the app, after registering, will find the "Home Screen" which consists of 3 sections:

- User Bar: Displays the user's profile photo and name, and also contains the "Log Out" button to sign out.
- "New Kitten for Adoption" Button: This button allows navigation to the screen where a new kitten adoption report can be created.
- "Reports" List: Shows the kittens that have been announced for adoption. Each kitten has an indicator of the number of interested adopters, and a "delete" button in case the adoption posting is withdrawn.

From these 3 sections, other screens emerge:

- New Kitten Adoption Report: This screen is dedicated to obtaining the kitten's data to later show this information to "ADOPTERS" users. The geolocation at the time of registration is stored to later show its location, as well as an image of the kitten, its name, age, weight, special care, and a brief description.
- Selection of the "Adopter" User: By clicking on a kitten from the reports list, the screen with the list of users interested in adopting that kitten appears. On the right side of each ADOPTER who applied, there is the "DELIVER" button, so the "OWNER" user must choose the adopter to whom they wish to deliver the kitten by pressing this button.
- Confirmation Modal: Appears after selecting the "ADOPTER" user to whom the kitten will be delivered.

[![owners-interface.png](https://i.postimg.cc/nckmR7xs/owners-interface.png)](https://postimg.cc/svM11Mvy)

#### ADOPTERS Interface
A user who wants to adopt a kitten in the app, after registering, will find the "Home Screen" which consists of 3 sections:

- User Bar: Displays the user's profile photo and name, and also contains the "Log Out" button to sign out.
- "Nearby Kittens" Map: Through a map provided by React Google Maps, avatars of nearby kittens available for adoption can be viewed.
- "News" Button: Displays a button with a badge indicating the number of adoption applications the user has made.

From these 3 sections, other screens emerge:

- "Kitten Information" Screen: After clicking on a nearby kitten avatar on the map, the screen showing all the kitten's data provided by the "OWNER" user, as well as their name and photo, appears. There is also an "ADOPT" button which, when pressed, will bring up the following modal.
- "Adoption Request Sent" Modal: This modal confirms that the application was successful and also informs that the "OWNER" user of the kitten will review it and may accept or reject the application.
- "News" Screen: Appears after pressing the "News" button, here the list of adoption applications made by the user and their status are shown. The status can be "Under Review": The OWNER has not yet decided to whom the kitten will be delivered, "Approved": The user has been chosen for adoption, and "Not Approved": The user has not been chosen for adoption, or the kitten has already been delivered to another "ADOPTER" user.

[![adopters-interface.png](https://i.postimg.cc/ncR8GRXC/adopters-interface.png)](https://postimg.cc/XpCDVgcb)

#### Database
The ADOPT-MEow application has its own database: https://adopt-meow-back-emd-production.up.railway.app/api
This database was developed by the collaborator Miguel Ortiz. He was in charge of developing the endpoints according to the business rules proposed for each interface.

Additionally, the @react-native-async-storage/async-storage dependency was installed to locally store the "user" object, and then send the logged-in user's id to the API for managing certain functionalities.

### Technologies Used
The technologies used for the development of this mobile application were:
##### Base Programming Language
- JavaScript
- JavaScript Framework: React Native
##### Data Typing
- TypeScript
##### Screen Navigation
- React Navigation Native Stack
##### Styles
- Native React Native Components
- Tailwind CSS
- Nativewind
- React Native Reanimated
##### HTTP Requests to API
- Axios
##### Local State Management
- React Native Async Storage
##### Maps
- React Native Maps
- React Native Maps Clustering
- Expo location
##### Version Control
- Git
### Contributing Developers
##### Developed by:
- Mobile Application: Emmanuel Ortiz, Junior Front-End Developer.
  https://www.linkedin.com/in/emmanuel-ortiz-745427273/
- API: Miguel Ortiz, Junior Full-Stack Developer.
  https://www.linkedin.com/in/miguel-ortiz-9736b32a5/
##### Code Review by:
  Fernando A. Gonzalez, Software Lead Engineer.
  https://www.linkedin.com/in/fernando-a-gonzalez/

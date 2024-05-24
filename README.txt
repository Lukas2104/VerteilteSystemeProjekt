# bildermalenundverschicken

Das Projekt "bildermalenundverschicken" ist eine vom PictoChat des Nintendo DS inspierierte Web-Anwendung, bei der Nutzer einem Raum beitreten können, um Nachrichten in diesem untereinander auszutauschen.

## Inspiration - PictoChat
Nintendo PictoChat ist eine Kommunikationsanwendung für den Nintendo DS, mit der Benutzer Textnachrichten und Zeichnungen über eine drahtlose Verbindung austauschen können. Die App ermöglicht es den Spielern, sich in einem von vier Chat-Räumen zu verbinden und in Echtzeit miteinander zu kommunizieren. PictoChat nutzt den Touchscreen und den Stylus des DS, um sowohl handschriftliche Nachrichten als auch Skizzen zu erstellen.

![pictowiki](https://github.com/Lukas2104/bildermalenundverschicken/assets/39993215/a06357a5-d522-417e-8d7f-3e33d352d13e)

(https://en.wikipedia.org/wiki/PictoChat)

## Idee und Planung
Im Rahmen der Umsetzung des Projektes sollen folgende Anforderungen erfüllt werden:

- Clients verbinden sich miteinander,
- Clients können mit der Hand geschriebene Nachrichten und selbstgemalte Bilder publizieren,
- Die Nachrichten werden bei anderen Usern in einer Nachrichtenhistorie angezeigt,
- Die Nachrichten werden P2P gesendet,

Als Benutzeroberfläche soll eine vereinfachte Version des PictoChats nachgebaut werden.

## Ergebnis

1. Startseite mit Input für den Benutzernamen und Button zum Beitreten des Chat-Raums.

![](images/0_HomeScreen.png)

2. Chat-Seite jeweils aus Sicht von Peer A (Lukas) und Peer B (Cesar).

![](images/1_PeerA_ChatScreen.png)
![](images/2_PeerB_ChatScreen.png)

3. Peer B zeichnet eine Nachricht auf seine Leinwand.

![](images/3_PeerB_DrawMessage.png)

4. Peer A empfängt die von Peer B gezeichnete und versendete Nachricht

![](images/4_PeerA_MessageFromPeerB.png)

5. Peer A holt die Nachricht in seine Leinwand und zeichnet anschließend mit dem dicken Stift ein Ausrufezeichen hinzu.

![](images/5_PeerA_DrawResponse.png)
![](images/6_PeerA_TryThickPencil.png)

6. Peer A sendet die Antwort an Peer B. Die Antwort erscheint in beiden Chatverläufen.

![](images/7_PeerA_SendRespones.png)
![](images/8_PeerB_ReceiveResponseFromPeerA.png)

7. Peer B erhlält die Antwort von Peer A.

![](images/8_PeerB_ReceiveResponseFromPeerA.png)

8. Beide Clients nebeneinander.

![](images/9_SideBySide.png)

## Umsetzung
Die Anwendung wird in Javscript/Typescript mit einem React Frontend implementiert.
Das Frontend wurde in React geschrieben. Dementsprechend sieht die Projektstruktur wie folgt aus:

```md
bilermalenundverschicken
├── node_modules
├── public
├── radata
├── src
│   ├── compontents
│   │   ├── UserCanvas.tsx
│   │   ├── UserCanvasContainer.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── UserContainer.tsx
│   ├── styles
│   │   ├── mainStyles.css
│   ├── App.tsx
│   ├── index.tsx
├── .gitignore
├── package-lock.json
├── package.json
├── server.js
└── tsconfig.json
```

Die Anwendung besteht aus mehreren Komponenten und Seiten. Folgend werden die wichtigsten Dateien und ihre Funktionen erklärt.

### index.tsx
Diese Datei ist der Einstiegspunkt der React-Anwendung. Sie rendert die `App`-Komponente innerhalb des Root-Elements im HTML-Dokument.

### App.tsx
Diese Date definiert die Hauptanwendungskomponente, die das Routing innerhalb der Anwendung behandelt. 

#### Routes
- `<Route path="" element={<Home/>}>`: Definiert die Route für die Startseite (`Home.tsx`)
- `<Route path="/chat" element={<UserContainer >}>`: Definiet die Route für den Chat-Bereich (`UserContainer.tsx`)

### Home.tsx
Diese Datei definiert die Home-Komponente, die die Startseite darstellt und es dem Benutzer mittels eines Formulars ermöglicht, einen Benutzernamen einzugeben und einem Raum beizutreten.

#### UI-Komponenten
- UsernameInput
- SquareButton
- ButtonContainer
- TitleContainer
- Title
- JoinFormContainer
- Centered
- UserInfoAndJoinContainer

#### Funktion
- `joinRoom`: Wird aufgerufen, wenn das Formular abgesendet wird und den Benutzer zur Chat-Seite weiterleitet; Benutzername wird als URL-Parameter übergeben

### UserContainer.tsx
Diese Datei definiert die UserContainer-Komponente, die den `UserCanvasContainer`-Komponenten importiert und rendert.

### UserCanvas.tsx
Die `Canvas`-Komponente erweitert `React.Component`, um eine anpassbare Zeichenfläche mithilfe der `ReactSketchCanvas`-Bibliothek zu erstellen. Diese Komponente bietet Funktionen für verschiedene Stiftmodi, das Löschen, das Leeren der Leinwand und das Exportieren der Zeichnung als SVG oder Image. Sie ermöglicht auch dynamische Anpassungen der Stiftgröße und -farbe

#### UI-Komponente
- `ReactSketchCanvas`: Das Hauptelement der Leinwand, konfiguriert mit benutzerdefinierten Stilen und Funktionen

#### Funktionen
- `constructor`: Initialisiert den Komponentenstatus (`strokeWidth` auf 3) und richtet die Canvas-Referenz ein.
- `bigPenMode`: Setzt die Breite des Stiftstrichs auf 7
- `smallPenMode`: Setzt die Breite des Stiftstrichs wieder auf 3
- `eraseMode`: Aktiviert den Radiergummimodes auf der Leinwand
- `penMode`: Deaktiviert den Radiergummimodes und ermöglicht das Zeichnen mit dem Stift
- `clearCanvas`: Löscht alle Zeichnungen auf der Leinwand
- `grabSvg`: Exportiert die aktuellen Zeichenpfade als SVG
- `fillSvg`: Lädt die übergebenen Pfade auf die Leinwand
- `grabImage`: Exportiert die aktuelle Zeichnung als PNG-Bild

Außer dem `constructor` werden alle Funktionen exportiert, damit sie in `UserCanvasContainer.tsx` genutzt werden können.

### UserCanvasContainer.tsx
Diese Komponente ist verantwortlich für das Rendern der Benutzeroberfläche der Chat-Seite und das Handling der Benutzerinteraktionen im Zusammenhang mit dem Zeichen auf dem Canvas und die P2P Kommunikation. Damit ist sie die eigentlich Hauptkomponente der Anwendung.

#### Importierte Komponenten und allgemeine Variablen
- `Canvas`: Benutzerdefinierte Komponente, die aus `./UserCanvas` importiert wird un den Zeichenbereich darstellt.
- `configuration`: Speichert iceServer zum Verbindungsaufbau mit anderen Peers

#### Zustandsverwaltung
- `penType`: Boolean-State zum Umschalten zwischen Stift- und Radiergummimodes.
- `penWidth`: Boolean-State zum Umschalten zwischen kleiner und großer Schriftgröße
- `messages`: Array-State zum Speichern von Chatnachrichten (Zeichnungen)
- `socket`: State zur Verwaltung der WebSocket-Verbindung
- `userCanvas`: Referenz zum Canvas, in dem gezeichnet werden kann
- `username`: State zum Speichern des Benutzernamens, abgerufen aus dem URL-Parameter oder standardmäßig auf "Test-User" gesetzt
- `peerConnections` und `dataChannels`: Referenzen zum Speichern von Peer-Verbindungen und Datenkanälen (für P2P-Nachrichtenaustausch)
- `messagesEndRef`: Referenz zur Verwaltung des automatischen Scrollens zur neuesten Nachricht

#### WebSocket-Integration
Das WebSocket-Setup findet in der ersten `useEffect`-Hook statt. Hier wird die WebSocket-Verbindung zum Server (siehe server.js) initialisiert und Ereignislistener für den Empfang von Nachrichten und die Handhabung von Peer-Verbindungen eingerichtet.

##### Ereignislistener:
- `receive_message`: Handhabt verschiedene Arten eingehender Nachrichten wie Offers, Answers und ICE-Kandidaten
- `new_peer`: Erstellt eine neue Peer-Verbindung, wenn ein neuer Peer beitritt

##### Ereignis-Emitter:
- `new_peer`: Benachrichtigt den Server über eine neue Peer-Verbindung
- `send_message`: Sendet Nachrichten, Angebote, Antworten und ICE-Kandidaten an den Server

##### WebRTC Integration:
- Erstellen von  Peer-Verbindungen: Funktionen zur Handhabung der Erstellung und Konfiguration von Peer-Verbindungen und Datenkanälen (`createPeerConnection` und `setupDataChannel`)
- Handhabung von Offers und Answers: Asynchrone Funktionen zur Verarbeitung von WebRTC-Angeboten und -Antworten für Peer-Verbindungen (`handleOffer` und `handleAnswer`)
- Handhabung von ICE-Kandidaten: Fügt Ice-Kandidaten zu den jeweiligen Peer-Verbindungen hinzu (`handleCandidate`)

#### UI-Komponenten

Nachrichtencontainer:
- MessagesContainer: Beinhaltet die Nachrichten und die Seitennavigation (Zurück-Schaltfläche)
- PreviousMessagesContainer: Zeigt die Liste der vorherigen Nachrichten an
- MessagesTextContainer: Zeigt den Benutzername mit entsprechendem Styling zu der jeweiligen Nachricht an

Leinwand und Benutzerbereich:
- CanvasAndButtonContainer: Umschließt die Leinwand und die Schaltflächen
- UserAreaContainer: Beinhaltet benutzerspezifische Elemente wie den Benutzernamen
- UserInputContainer: Umschließt die Leinwand
- CanvasContainer: Positioniert und styled die Leinwand

Schaltflächen:
- Stift: Schaltet in den Stiftmodus
- Radierer: Schaltet in den Radiergummimodus
- Klein: Setzt die Stiftgröße auf klein
- Groß: Setzt die Stiftgröße auf groß
- Senden: Sendet die aktuelle Zeichnung an andere Peers
- Holen: Ruft die letzte Nachricht ab und zeigt sie auf der Leinwand zu Weiterbearbeitung an
- Löschen: Löscht den Inhalt der Leinwand

#### Funktionen
- `createPeerConnection`: Initialisiert eine neue Peer-Verbindung und richtet Ereignislistener für ICE-Kandidaten und Datenkanäle ein
- `setupDataChannel`: Konfiguriert den Datenkanal zum Senden und Empfangen von Nachrichten
- `handleOffer`: Handhabt eingehende WebRTC-Angebote von Peers
- `handleAnswer`: Handhabt eingehende WebRTC-Antworten von Peers
- `handleCandidate`: Handhabt eingehende ICE-Kandidaten für Peer-Verbindungen
- `sendMessage`: Sendet die aktuelle Zeichnung als Nachricht an alle verbundenen Peers
- `getLastMessage`: Ruft die letzte Nachricht aus der Nachrichtenliste ab und zeigt sie auf der Leinwand an
- `backToHome`: Leitet den Benutzer zurück zur Startseite

#### Ablauf beim Verbinden eines neuen Peers
1. Verbindung des neuen Peers zum WebSocket-Server (`connection` in `server.js`): Ein neuer Socket wird erstellt und der Server loggt, dass ein neuer Client verbunden ist; Weitere Ereignislistener werden für den Socket eingerichtet.
2. Benachrichtigung der andereen Peers über den neuen Peer (`new_peer` in `server.js`): Der neue Peer sendet Nachricht an den Server, um seine Anwesenheit bekannt zu geben; Server sendet `new_peer`-Benachrichtigung an alle anderen verbundenen Clients.
3. Verarbeitung der `new_peer`-Nachricht bei bestehenden Peers (`new_peer` in `UserCanvasContainer.tsx`): Beim Empfang der `new-peer`-Nachricht erstellt jeder bestehende Peer eine neue Peer-Verbindung zum neuen Peer; `createPeerConnection` wird aufgerufen.
4. Erstellen der Peer-Verbindung (`createPeerConnection` in `UserCanvasContainer.tsx`): Neues `RTCPeerConnection`-Objekt wird erstellt; Wenn Peer der Initiator ist, wird ein Datenkanal erstellt und eine Offer an den neuen Peer gesendet; wenn der Peer nicht der Initiator ist, wird auf den Empfang eines Datenkanals und Angebots gewartet und ein eigener Datenkanal erstellt, um beidseitige Kommunikation zu ermöglichen.
5. Einrichtung des Datenkanals (`setupDataChannel` in `UserCanvasContainer.tsx`): Konfiguriert den Datenkanal, um Nachrichten zu senden und zu empfangen.
6. Handhabung der Angebote und Antworten (`handleOffer` und `handleAnswer` in `UserCanvasContainer.tsx`): `handleOffer` empfängt ein Angebot und sendet eine Answer; `handleAnswer` empfängt eine Antwort und stellt die Verbindung her.
7. Handhabung der ICE-Kandidaten (`handleCandidate` in `UserCanvasContainer.tsx`): Fügt empfangene ICE-Kandidaten zur Peer-Verbindung hinzu, um diese zu optimieren.

### server.js
Diese Datei implementiert einen WebSocket-Server mit Express, HTTP und Socket.IO. Der Server ermöglicht die Verbindungsherstellung neuer P2P-Verbindungen zwischen verschiedene Clients. Er agiert also als Signalisierungsserver.

#### Server-Setup
- `app`: Initialisiert eine Express-Anwendung
- `server`: Erstellt einen HTTP-Server unter der Verwendung der Express-Anwendung
- `io`: Initialisiert eine Sockt.IO-Instanz mit CORS-Konfiguration, die Verbindungen von allen Ursprüngen erlaubt

#### WebSocket-Integration
Ereignislistener
- `connection`: Wird ausgelöst, wenn neuer Client eine Verbindung zum Server herstellt; Loggt, dass neuer Client verbunden ist; Richtet zusätzliche Ereignislistener ein

Ereignis-Handler
- `send_message`: Wird ausgelöst, wenn Client eine Nachricht sendet; Löst `receive_message`-Ereignis beim Zielclient aus
- `new_peer`: Wird ausgelöst, wenn neuer Peer dem Netzwerk beitritt; Sendet `new_peer`-Benachrichtigung an alle verbundenen Clients
- `disconnect`: Wird ausgelöst, wenn ein Client die Verbindung trennt, Loggt, dass Verbindung von Client getrennt wurde

#### Server-Start
- `PORT`: Definiert Port, auf dem der Server listened (4000)
- `server.listen`: Startet den Server

## Installation und Ausführen der Anwendung

### Als GitHub Repository:

1. Repository klonen:
```
clone git@github.com:Lukas2104/VerteilteSystemeProjekt.git
cd VerteilteSystemeProjekt/bildermalenundverschicken
```

2. Abhängigkeiten installieren:
```
npm install
```

3. Server starten:
```
node server.js
```

4. Applikation starteN:
```
npm start
```

Die Anwendung kann jetzt (in mehreren Browsertabs) über `http://localhost:3000` erreicht werden.

### Als ZIP-Datei:
1. Datei in beliebiges Verzeichnis entpacken und navigieren zu:
```
cd VerteilteSystemeProjekt/bildermalenundverschicken
```

2. Abhängigkeiten installieren:
```
npm install
```

3. Server starten:
```
node server.js
```

4. Applikation starteN:
```
npm start
```

Die Anwendung kann jetzt (in mehreren Browsertabs) über `http://localhost:3000` erreicht werden.

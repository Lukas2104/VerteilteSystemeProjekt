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
- und die Nachrichten werden an alle Teilnehmer im gleichen LAN (Auto-Erkennung) gesendet.

Als Benutzeroberfläche soll eine vereinfachte Version des PictoChats nachgebaut werden.

## Umsetzung
Die Anwendung wird in Javscript/Typescript mit einem React Frontend implementiert.

### Frontend
Das Frontend wurde in React geschrieben. Dementsprechend sieht die Projektstruktur wie folgt aus:

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

### Backend

## Installation und Ausführen der Anwendung

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

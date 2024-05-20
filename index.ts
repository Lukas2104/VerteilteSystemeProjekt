import { RemoteInfo, Socket } from "dgram";

const dgram = require('dgram')
var os = require('os')
 
const PORT = 3000;
const login_message_start = "login "

class p2pService{
 
    onMessage: Function;
    username: string;
    connected_ips: Map<string, string>;
    broadcast_address: string;
    server: Socket = dgram.createSocket('udp4');
 
    constructor(name: string, callback: Function){
        this.username = name;
        this.onMessage = callback;
        this.connected_ips = new Map<string, string>();
        this.connect();
 
        var networkInterfaces = os.networkInterfaces()
        var address;
        try{
            // Mac and Linux get address
            address = networkInterfaces["en0"][0].address
        }catch(error){
            // Windows get address
            address = networkInterfaces["Wi-Fi"][1].address
        }
 
        const submasks = address.split(".")
        this.broadcast_address = submasks[0] + "." + submasks[1] + "." + submasks[2] + ".255";  
 
    }
 
   
    connect(){
        this.server.on('message', this.parseMessage);
 
        this.server.on('listening', this.broadcast_hello);
         
        this.server.on('close', () => {});
       
        this.server.bind(PORT, this.broadcast_address);
    }
 
    parseMessage(msg: string, rinfo: RemoteInfo) {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        if(msg.startsWith(login_message_start)){
            var username = msg.replace(login_message_start, "");
            this.connected_ips.set(rinfo.address, username);
        }else{
            this.onMessage(msg);
        }
    };
 
    broadcast_hello() {
        const address = this.server.address();
        console.log(`server listening ${address.address}:${address.port}`);
        this.server.setBroadcast(true)
        this.server.send(login_message_start + this.username,PORT, this.broadcast_address, (err: Error) => {
            if (err == null) {
            console.log(err);
        }
        })
    }
 
}
 
var p2p = new p2pService("cesar", (message: string) => console.log(message))
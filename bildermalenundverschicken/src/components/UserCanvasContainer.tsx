import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { Canvas } from "./UserCanvas";

const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};

export const UserCanvasContainer = () => {
    const [penType, setPenType] = useState(true);
    const [penWidth, setPenWidth] = useState(true);
    const [messages, setMessages] = useState<any>([]);
    const [socket] = useState(() => io("http://localhost:4000"));
    const [userColor] = useState<any>("gray");
    const [userLighterColor] = useState("lightgray");
    const userCanvas = useRef<any>();
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState<any>("Test-User");
    const peerConnections = useRef<any>({});
    const dataChannels = useRef<any>({});
    const messagesEndRef = useRef<any>(null);

    useEffect(() => {
        socket.on("receive_message", async (data) => {
            if (data.type === "offer") {
                await handleOffer(data);
            } else if (data.type === "answer") {
                await handleAnswer(data);
            } else if (data.type === "candidate") {
                await handleCandidate(data);
            } else {
                setMessages((prevMessages: any) => [...prevMessages, data]);
            }
        });

        socket.on("new_peer", (data) => {
            createPeerConnection(data.from, true);
        });

        socket.emit("new_peer", { from: socket.id });

        return () => {
            socket.off("receive_message");
            socket.off("new_peer");
        };
    }, [socket]);

    useEffect(() => {
        try {
            setUsername(searchParams.get("username"));
        } catch (e) {
            console.error(e);
        }
    }, [searchParams]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    const createPeerConnection = (peerId: any, isInitiator: any) => {
      const pc = new RTCPeerConnection(configuration);

      pc.onicecandidate = (event) => {
          if (event.candidate) {
              socket.emit("send_message", {
                  type: "candidate",
                  candidate: event.candidate,
                  to: peerId,
                  from: socket.id
              });
          }
      };

      if (isInitiator) {
          const dataChannel = pc.createDataChannel("sendChannel");
          setupDataChannel(peerId, dataChannel);
          
          pc.createOffer()
              .then(offer => pc.setLocalDescription(offer))
              .then(() => {
                  socket.emit("send_message", {
                      type: "offer",
                      offer: pc.localDescription,
                      to: peerId,
                      from: socket.id
                  });
              })
              .catch(e => console.error(e));
      } else {
          pc.ondatachannel = (event) => {
              const receiveChannel = event.channel;
              setupDataChannel(peerId, receiveChannel);
          };
      }

      pc.onconnectionstatechange = (event) => {
          if (pc.connectionState === 'connected') {
              console.log("Peers connected");
          }
      };

      peerConnections.current[peerId] = pc;
  };

  const setupDataChannel = (peerId: any, dataChannel: any) => {
      dataChannel.onopen = () => console.log("Data channel open with", peerId);
      dataChannel.onclose = () => console.log("Data channel closed with", peerId);
      dataChannel.onmessage = (event: any) => {
          const msg = JSON.parse(event.data);
          setMessages((prevMessages: any) => [...prevMessages, msg]);
      };
      dataChannels.current[peerId] = dataChannel;
  };

    const handleOffer = async (data: any) => {
        createPeerConnection(data.from, false);
        const pc = peerConnections.current[data.from];

        const desc = new RTCSessionDescription(data.offer);
        await pc.setRemoteDescription(desc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("send_message", {
            type: "answer",
            answer: pc.localDescription,
            to: data.from,
            from: socket.id
        });
    };

    const handleAnswer = async (data: any) => {
        const pc = peerConnections.current[data.from];
        const desc = new RTCSessionDescription(data.answer);
        await pc.setRemoteDescription(desc);
    };

    const handleCandidate = async (data: any) => {
        const pc = peerConnections.current[data.from];
        if (pc) {
            const candidate = new RTCIceCandidate(data.candidate);
            await pc.addIceCandidate(candidate);
        }
    };

    const sendMessage = async () => {
        const message = {
            username: username,
            svg: await userCanvas.current.grabSvg(),
            image: await userCanvas.current.grabImage()
        };

        const msgString = JSON.stringify(message);
        Object.values(dataChannels.current).forEach((channel: any) => {
            if (channel.readyState === 'open') {
                channel.send(msgString);
            }
        });

        setMessages((prevMessages: any) => [...prevMessages, message]);
        userCanvas.current.clearCanvas();
    };

    const getLastMessage = () => {
      userCanvas.current.clearCanvas();
      let lastMessage = messages[messages.length-1];
      userCanvas.current.fillSvg(lastMessage.svg);
    } 

    const backToHome = (e: any) => {
        e.preventDefault();
        window.location.href = window.location.origin;
    };

    return (
        <>
            <Centered>
                <MessagesContainer>
                    <MessagesSideContainer>
                        <SquareButton className="home" onClick={backToHome}>
                            Zurück
                        </SquareButton>
                    </MessagesSideContainer>
                    <MessagesAreaContainer>
                        <PreviousMessagesContainer>
                            {messages.map((msg: any, index: any) => (
                                <PreviousMessage
                                    key={index}
                                    className="canvas"
                                    style={{
                                        backgroundImage: `url(${msg.image})`,
                                    }}
                                >
                                    <MessagesTextContainer>
                                        <p>
                                            <div
                                                style={{
                                                    borderColor: "gray",
                                                    backgroundColor: "lightgray",
                                                }}
                                            >
                                                <h3 style={{ color: "gray" }}>{msg.username}</h3>
                                            </div>
                                        </p>
                                    </MessagesTextContainer>
                                </PreviousMessage>
                            ))}
                            <div ref={messagesEndRef} />
                        </PreviousMessagesContainer>
                    </MessagesAreaContainer>
                </MessagesContainer>
                <CanvasAndButtonContainer>
                    <ButtonsContainer>
                        <SquareButton
                            style={{
                                backgroundColor: `${penType ? userLighterColor : "gray"}`,
                            }}
                            onClick={() => {
                                userCanvas.current.penMode();
                                setPenType(true);
                            }}
                        >
                            Stift
                        </SquareButton>
                        <SquareButton
                            style={{
                                backgroundColor: `${penType ? userColor : "lightgray"}`,
                            }}
                            onClick={() => {
                                userCanvas.current.eraseMode();
                                setPenType(false);
                            }}
                        >
                            Radierer
                        </SquareButton>
                        <br />
                        <SquareButton
                            style={{
                                backgroundColor: `${penWidth ? userLighterColor : "gray"}`,
                            }}
                            onClick={() => {
                                userCanvas.current.smallPenMode();
                                setPenWidth(true);
                            }}
                        >
                            Klein
                        </SquareButton>
                        <SquareButton
                            style={{
                                backgroundColor: `${penWidth ? userColor : "lightgray"}`,
                            }}
                            onClick={() => {
                                userCanvas.current.bigPenMode();
                                setPenWidth(false);
                            }}
                        >
                            Groß
                        </SquareButton>
                        <br />
                        <SquareButton className="send" onClick={sendMessage}>
                            Senden
                        </SquareButton>
                        <SquareButton className="getLast" onClick={getLastMessage}>
                            Holen
                        </SquareButton>
                        <SquareButton
                            className="clear"
                            onClick={() => {
                                userCanvas.current.clearCanvas();
                            }}
                        >
                            Löschen
                        </SquareButton>
                    </ButtonsContainer>
                    <UserAreaContainer>
                        <UserContainer>
                            <UserBox>
                                <UserColorBox />
                                <p>{username}</p>
                            </UserBox>
                        </UserContainer>
                        <UserInputContainer>
                            <CanvasContainer>
                                <Canvas ref={userCanvas} color="gray" />
                                <CanvasTextContainer>
                                    <p>
                                        <div
                                            style={{
                                                borderColor: "gray",
                                                backgroundColor: "lightgray",
                                            }}
                                        >
                                            <h3 style={{ color: "gray" }}>{username}</h3>
                                        </div>
                                    </p>
                                </CanvasTextContainer>
                            </CanvasContainer>
                        </UserInputContainer>
                    </UserAreaContainer>
                </CanvasAndButtonContainer>
            </Centered>
        </>
    );
};

const Centered = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    height: calc(100vh - 50px);
`;

const CanvasAndButtonContainer = styled.div`
    width: 100%;
    max-width: 480px;
    background: white;
    height: 260px;
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 600px) {
        height: 260px;
    }
`;

const ButtonsContainer = styled.div`
    width: 100px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 30px;

    @media screen and (max-width: 600px) {
        height: 200px;
    }
`;

const SquareButton = styled.div`
    width: 60px;
    height: 25px;
    margin-bottom: 3px;
    background: gray;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        filter: brightness(105%);
    }

    & svg {
        padding: 5px;
    }
`;

const UserAreaContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    overflow: hidden;
    margin-bottom: 30px;
    margin-right: 30px;
`;

const UserContainer = styled.div`
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-right: 10px;
`;

const UserColorBox = styled.div`
    width: 15px;
    height: 15px;
    background: gray;
`;

const UserBox = styled.div`
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    height: 20px;
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: auto;
`;

const UserInputContainer = styled.div`
    background: #aaaab3;
    width: 100%;
    max-width: 450px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    & div:first-child {
        margin-right: 5px;
    }

    @media screen and (max-width: 600px) {
        height: 200px;
    }
`;

const CanvasContainer = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    margin-top: 16px;
    margin-left: 10px;
    justify-content: flex-end;
`;

const CanvasTextContainer = styled.div`
    position: absolute;
    top: 0;
    width: calc(100% - 30px);
    left: 16px;
    height: calc(100%);
    user-select: none;
    pointer-events: none;
    display: flex;

    & div {
        min-width: 100px;
        height: 30px;
        border: 3px solid gray;
        border-top: 2px solid gray;
        border-bottom-right-radius: 8px;
        border-top-left-radius: 8px;
        display: inline-block;
        text-align: center;
        line-height: 0;
        background: white;
        margin-left: -5px;

        & h3 {
            margin-top: 15px;
            font-size: 20px;
        }
    }

    & p {
        margin-top: 1px;
        line-height: 30px;
        padding-left: 5px;
        overflow-wrap: break-word;
        white-space: pre-line;
    }
`;

const MessagesContainer = styled.div`
    width: 100%;
    max-width: 480px;
    background: #aaaab3;
    background: white;
    height: 260px;
    display: flex;
    justify-content: space-between;
`;

const PreviousMessagesContainer = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    bottom: 0;

    &::-webkit-scrollbar {
        display: none;
    }

    width: 100%;
    height: calc(100% - 20px);
    overflow-y: auto;
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: flex-end;
`;

const PreviousMessage = styled.div`
    width: calc(100% - 20px);
    height: 165px;
    background-color: white;
    min-height: 165px;
    margin-right: 5px;
    border: 3px solid gray;
`;

const MessagesSideContainer = styled.div`
    width: 100px;
    height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 600px) {
        height: 200px;
    }
`;

const MessagesAreaContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    overflow: hidden;
    margin-right: 30px;
    padding-right: 4px;
    background-color: #aaaab3;;
`;

const MessagesTextContainer = styled.div`
    position: absolute;
    top: 0;
    width: calc(100% - 30px);
    left: 16px;
    height: calc(100%);
    user-select: none;
    pointer-events: none;
    display: flex;

    & div {
        min-width: 100px;
        height: 30px;
        border: 3px solid gray;
        border-top: 2px solid gray;
        border-bottom-right-radius: 8px;
        border-top-left-radius: 8px;
        display: inline-block;
        text-align: center;
        line-height: 0;
        background: white;
        margin-left: -19px;

        & h3 {
            margin-top: 15px;
            font-size: 20px;
        }
    }

    & p {
        margin-top: -2px;
        line-height: 30px;
        overflow-wrap: break-word;
        white-space: pre-line;
    }
`;
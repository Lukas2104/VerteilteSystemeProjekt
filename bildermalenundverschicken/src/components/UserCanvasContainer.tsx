import React, { useEffect, useRef, useState } from "react";
//import { ReactSketchCanvas } from "react-sketch-canvas";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client"
//import Color from "color";
import styled from "styled-components";
/*
import {
    BigBrushIcon,
    ClearIcon,
    EraserToolIcon,
    PenToolIcon,
    PictoLogo,
    PullIcon,
    SendIcon,
    SmallBrushIcon,
  } from "../icons/CanvasIcons";
*/
//import { Keys } from "./Keys";
import { Canvas } from "./UserCanvas";
//import { isMobile } from "react-device-detect";
//import { ClipLoader } from "react-spinners";
//import { BiShare } from "react-icons/bi";
//import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
//import { AiOutlineClose } from "react-icons/ai";

export const UserCanvasContainer = () => {
    
    const [userInput, setUserInput] = useState("");
    const [penType, setPenType] = useState(true);
    const [penWidth, setPenWidth] = useState(true);
    const [messages, setMessages] = useState<any>([]);
    const [socket] = useState(() => io("wss://picto-socket.onrender.com/"))
    const [userColor, setUserColor] = useState("gray");
    const [userLighterColor, setUserLighterColor] = useState("lightgray");
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState("");

    const userCanvas = useRef<any>();
    const messageContainerRef = useRef<any>();
    const [searchParams] = useSearchParams();

    /*
    useEffect(() => {
        const color = Color(userColor);
        const lighterColor = Color(color).lighten(0.6).toString();

        if (Color(lighterColor).hex() === Color({ r: 255, g: 255, b: 255 }).hex()) {
            setUserLighterColor(color.lighten(0.25).toString());
        } else {
            setUserLighterColor(lighterColor)
        }
    }, [userColor]);

    useEffect(() => {
        if (
            searchParams.get("username") === null ||
            searchParams.get("username") === "" ||
            searchParams.get("roomname") === null ||
            searchParams.get("roomname") === ""
        ) {
            window.location.href = window.location.origin;
        }

        socket.emit("joinRoom", {
            username: searchParams.get("username"),
            roomname: searchParams.get("roomname"),
        });

        return () => {
            socket.emit("leave room");
        };
    }, []);
    */

    const sendMessage = async () => {
        
        let message = {
            //text: userInput,
            svg: await userCanvas.current.grabSvg(),
            image: await userCanvas.current.grabImage(),
        };
        userCanvas.current.clearCanvas();
        //setUserInput("");
        await socket.emit("chat", message)
    }

    /*

    useEffect(() => {
        socket.on("message", (recv: any) => {
          setMessages((om: any) => [...om, recv]);
        });
      }, []);

    useEffect(() => {
        let announcement_messages = messages.filter(
            (msg: any) => msg.type === "announcement"
        );
        socket.connected &&
          messageContainerRef?.current.scrollIntoView({ behavior: "smooth"});
        setUserColor(messages[0]?.currentUserColor);
        console.log(messages.filter((msg: any) => msg));
        setUsersInRoom(
          announcement_messages[announcement_messages.length - 1]?.users
        );
        socket.connected &&
          userCanvas.current.setColor(messages[0]?.currentUserColor);
    }, [messages]);

    const scrollMessages = (sign: number) => {
        messageContainerRef?.current?.scrollTo({ x: 0, y: 100 * sign });
    }

    useEffect(() => {
        if (!socket.connected) {
            setTimeout(() => {
                setLoadingMessage("if loading continues consider refreshing");
            }, 5000);
        }
    }, []);

    const leaveRoom = () => {
        window.location.href = window.location.origin;
    };
    */

    return (
        <>
          <Centered>
            <MessagesContainer>
              <PreviousMessagesContainer>
                <PreviousMessage>

                </PreviousMessage>
              </PreviousMessagesContainer>
            </MessagesContainer>

            <CanvasAndButtonContainer>
              <ButtonsContainer>
                <SquareButton
                  style={{
                    backgroundColor: `${
                        penType ? userLighterColor : "gray"
                    }`,
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
                    backgroundColor: `${
                        penType ? userColor : "lightgray"
                    }`,
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
                    backgroundColor: `${
                        penWidth ? userLighterColor : "gray"
                    }`,
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
                    backgroundColor: `${
                        penWidth ? userColor : "lightgray"
                    }`,
                  }}
                  onClick={() => {
                    userCanvas.current.bigPenMode();
                    setPenWidth(false);
                  }}
                >
                    Groß
                </SquareButton>
                <br />
                <SquareButton
                  className="send"
                  onClick={sendMessage}
                >
                    Senden
                </SquareButton>
                <SquareButton>
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
                        <UserColorBox/>
                        <p>Test-Nutzer</p>
                    </UserBox>
                </UserContainer>
                <UserInputContainer>
                    <CanvasContainer>
                    <Canvas 
                      ref={userCanvas}
                      color="gray"
                    />
                      <CanvasTextContainer>
                        <p>
                            <div
                              style={{
                                borderColor: "gray",
                                backgroundColor: "lightgray",
                              }}
                            >
                                <h3 style={{ color: "gray" }}>Test-Nutzer</h3>
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

















/*
const DisconnectButton = styled.div`
  width: 15px;
  height: 15px;
  background: lightgray;
  border: 1.5px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
  border-radius: 2px;
  cursor: pointer;
  transition-duration: 0.2s;

  &:hover {
    background: darkgray;
  }
`;

const ShareButton = styled.div`
  z-index: 1000;
  position: fixed;
  right: -3px;
  bottom: -3px;
  height: 40px;
  width: 40px;
  background: white;
  border: 3px solid darkgray;
  border-top-left-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;

  &::after {
    position: absolute;
    width: 45px;
    height: 45px;
    content: "";
    left: -6px;
    bottom: -6px;
    right: -6px;
    top: -6px;
    border: 3px solid white;
    border-top-left-radius: 12px;
    border-right: 0;
    border-bottom: 0;
  }
`;

const SendButton = styled.div`
  background-color: #d9d9d9;
  width: 100%;
  height: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & svg {
    height: 90%;
  }

  &:hover {
    filter: brightness(105%);
  }
`;

const MessageBlip = styled.div`
  width: 25px;
  height: 5px;
  background: gray;
  margin-bottom: 5px;
`;

const MessageMiniMap = styled.div`
  width: 35px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background: white;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const KeyboardContainer = styled.div`
  width: 100%;
  max-height: 148px;
  background: white;
  background-image: url("https://i.imgur.com/QkNhB5p.png");
  background-size: contain;
  overflow: hidden;

  margin-left: 10px;
  margin-top: 20px;
  margin-right: 10px;
  border-radius: 15px;

  @media screen and (max-width: 600px) {
    max-height: 120.5px;

    & * {
      display: none;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  height: 230px;
  flex-grow: 1;
`;

const SendButtonsContainer = styled.div`
  height: 150px;
  width: 80px;
  background: white;
  border-top-left-radius: 15px;
  overflow: hidden;
  border-bottom-left-radius: 15px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  & .clear {
    height: 24%;
    padding-top: 7px;
    padding-bottom: 6px;
  }
  & .send {
    height: 35%;
  }
  & .pull {
    height: 24%;
    padding-top: 7px;
    padding-bottom: 6px;
  }

  @media screen and (max-width: 600px) {
    max-height: 120.5px;

    & .clear {
      padding-top: 4px;
      padding-bottom: 3px;
    }
    & .send {
      padding-top: 2px;
      padding-bottom: 1px;
    }
    & .pull {
      padding-top: 4px;
      padding-bottom: 3px;
    }
  }
`;
*/
import { useRef } from "react";
import styled from "styled-components";

// var os = require('os');

export const Home = () => {
  let usernameRef = useRef<any>();

  const joinRoom = (e: any) => {
    e.preventDefault();
    window.location.href =
      window.location.origin +
      `/chat?username=${usernameRef.current.value}`;
  };

  return (
    <>
      <Centered>
        <TitleContainer>
          <Title>bildermalenundverschicken</Title>
        </TitleContainer>
        <UserInfoAndJoinContainer>
          <JoinFormContainer>
            <form onSubmit={joinRoom}>
              <PictoInput
                type="text"
                ref={usernameRef}
                name="username"
                placeholder="Nutzername"
                required
              ></PictoInput> 
              <ButtonContainer>
                <SqaureButton type="submit" name="submit">
                  Beitreten
                </SqaureButton>
              </ButtonContainer>
            </form>
          </JoinFormContainer>
        </UserInfoAndJoinContainer>
      </Centered>
    </>
);
};

const PictoInput = styled.input`
  width: 200px;
  border: 2px solid gray;
  padding: 5px;
`;

const SqaureButton = styled.button`
  width: 100px;
  height: 30px;
  border: 2px solid gray;
  background: lightgray;
  color: gray;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const TitleContainer = styled.div`
  width: 100%;
  max-width: 480px;
  background: #aaaab3;
  background: white;
  height: 260px;
  display: flex;
  justify-content: center;
`

const Title = styled.h1`
  margin-top: 100px;
  color: gray;
`

const JoinFormContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 650px;
  display: flex;
  align-items: center;
  justify-content: center;

  & h1 {
    text-align: center;
  }

  & h3 {
    text-align: center;
  }

  & form {
    padding: 50px;
    display: flex;
    flex-direction: column;

    & input {
      margin-bottom: 10px;
    }

    & button {
      margin-top: 10px;
    }
  }
`;

const Centered = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    height: calc(100vh - 50px);
`;

const UserInfoAndJoinContainer = styled.div`
    width: 100%;
    max-width: 480px;
    background: white;
    height: 260px;
    display: flex;
    justify-content: space-between;
`;
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

let socket: any;

type Message = {
  author: string;
  message: string;
};

type User = {
  id: string;
  username: string;
};

export const prisma = new PrismaClient();

export async function getServerSideProps() {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      id: true,
      profileImg: true,
    },
  });
  if (!users) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      users,
    },
  };
}

export default function Test({ users }: { users: User[] }) {
  // const [username, setUsername] = useState("");
  const usernameRef = useRef() as React.MutableRefObject<HTMLInputElement>; 
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/chat/socket");

    socket = io();

    socket.on("newIncomingMessage", async (msg: Message) => {
      console.log(messages);
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ]);
      //  await displayMessage(msg);
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setChosenUsername(usernameRef.current.value);
    socket.emit("joinRoomMessage", usernameRef.current.value);
  };
  // async function displayMessage(msg:Message) {
  //   const div = document.createElement("div")
  //   div.textContent = msg.author + ': ' + msg.message;

  //   document.getElementById('message-container')?.append(div)
  // }

  const sendMessage = async () => {
    if (message) {
      socket.emit("createdMessage", { author: chosenUsername, message }, room);
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: chosenUsername, message },
      ]);
      setMessage("");
    }
  };

  const handleKeypress = (e: any) => {
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 mx-auto min-h-screen justify-center bg-purple-500 h-[100%]">
      <div className="flex-none flex space-x-1">
        {users.map((user, key) => (
          <button key={key} className="bg-gray-200 rounded-all text-grey-700 p-2">
            <Link href={`/chats/${user.id}`}>{user.username}</Link>
          </button>
        ))}
      </div>

      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        {!chosenUsername ? (
          <>
            <h3 className="font-bold text-white text-xl">
              How people should call you?
            </h3>
            <input
              id="username"
              ref={usernameRef}
              type="text"
              placeholder="Identity..."
              className="p-3 rounded-md outline-none"
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-white rounded-md px-4 py-2 text-xl"
            >
              Go!
            </button>
          </>
        ) : (
          <>
            <p className="font-bold text-white text-xl">
              Your username: {chosenUsername} - {socket.id}
            </p>
            <div className="flex flex-col justify-end bg-white h-[20rem] min-w-[33%] rounded-md shadow-md ">
              {messages.map((msg, i) => {
                return (
                  <div
                    className="w-full py-1 px-2 border-b border-gray-200"
                    key={i}
                  >
                    {msg.author} : {msg.message}
                  </div>
                );
              })}
              <div className="border-t border-gray-300 w-full flex rounded-bl-md">
                <input
                  type="text"
                  placeholder="New message..."
                  value={message}
                  className="outline-none py-2 px-2 rounded-bl-md flex-1"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={handleKeypress}
                />
                <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
                  <button
                    className="group-hover:text-white px-3 h-full"
                    onClick={() => {
                      sendMessage();
                    }}
                    disabled={message ? false : true}
                  >
                    Send
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="room"
                    onChange={(e) => setRoom(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
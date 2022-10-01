import Link from "next/link" 
import React from "react";
import moment from "moment";
import { useRouter } from "next/router";
export default function ChatContactBox(contact: ContactProps) {
  const router = useRouter();
  const {user_id} = router.query;
  // console.log(typeof(user_id) );
  const selectedHost = user_id === contact.id.toString(); 

  return (
    <Link href={`/chats/guest/${contact.id}`}>
      <div
        className={`${
          selectedHost
            ? "bg-violet-500 text-white"
            : "text-gray-500 hover:bg-violet-200 "
        } w-full h-[100py-2 flex rounded-2xl items-center cursor-pointer my-2 mx-1 translation ease-in-out transition`}
      >
        <img
          className="w-1/5 rounded-full object-cover"
          src={`https://joeschmoe.io/api/v1/${contact.image}`}
          alt="image"
        />
        <div className="text-xs ">
          <p
            className={`font-bold ${
              selectedHost ? "text-white" : "text-black"
            }`}
          >
            {contact.name}
          </p>
          <p className="text-ellipsis overflow-hidden h-1/3 ...">
            {contact.lastMessage}
          </p>
          <p>{moment(parseInt(contact.createdAt)).format("LLL")}</p>
        </div>
      </div>
    </Link>
  );
}

type ContactProps = {
  id: number;
  name: string;
  createdAt: string;
  lastMessage: string;
  contactJoinDate: string;
  image: string;
};
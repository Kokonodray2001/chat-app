"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div className='flex flex-col'>
      <div>
        <span className='font-bold text-2xl p-2'>
          All Messages will appear here
        </span>
      </div>
      <div className='flex items-center'>
        <input
          type='text'
          placeholder='type message'
          className='p-2 m-2 shadow-md'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className='p-2 rounded-lg bg-green-400 shadow-md hover:bg-green-700'
          onClick={(e) => {
            sendMessage(message);
          }}
        >
          send
        </button>
      </div>
    </div>
  );
}

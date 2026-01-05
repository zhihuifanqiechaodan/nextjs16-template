"use client";

import { useEffect, useState } from "react";

export default function WebHome() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
    console.log(count);
  };
  // useEffect(() => {
  //   console.log("count", count);

  //   return () => {
  //     console.log("count unmount", count);
  //   };
  // }, [count]);
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => handleIncrement()}>Increment</button>
    </div>
  );
}

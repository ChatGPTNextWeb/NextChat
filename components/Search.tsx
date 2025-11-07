import React, { FormEvent, useState } from "react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle search here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-md bg-muted text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white mt-6"
        />
      </form>
    </div>
  );
}

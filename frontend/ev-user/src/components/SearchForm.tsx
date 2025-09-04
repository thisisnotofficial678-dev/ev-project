import { useState } from "react";

interface SearchFormProps {
  onSearch?: (query: {
    location: string;
    date: string;
    time: string;
    connector: string;
  }) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [connector, setConnector] = useState("CCS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = { location, date, time, connector };
    onSearch?.(query);
  };

  return (
    <div className="w-full px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 bg-white/90 backdrop-blur rounded-xl p-4 md:p-5 shadow-lg"
      >
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="City, address, or station"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Connector</label>
          <select
            value={connector}
            onChange={(e) => setConnector(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>CCS</option>
            <option>CHAdeMO</option>
            <option>Type 2</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;



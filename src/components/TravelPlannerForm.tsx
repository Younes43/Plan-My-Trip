'use client';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { Search, Calendar, DollarSign } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { Range, getTrackBackground } from 'react-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useRouter } from 'next/navigation';

const TravelPlannerForm = () => {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [budget, setBudget] = useState([500, 5000]);
  const [destination, setDestination] = useState('');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDateRangeText = () => {
    if (dateRange[0].startDate.getTime() === dateRange[0].endDate.getTime()) {
      return 'Check in - Check out';
    }
    return `${formatDate(dateRange[0].startDate)} - ${formatDate(dateRange[0].endDate)}`;
  };

  const handleSetDates = () => {
    setShowCalendar(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startDate = dateRange[0].startDate.toISOString().split('T')[0];
    const endDate = dateRange[0].endDate.toISOString().split('T')[0];
    const [budgetMin, budgetMax] = budget;

    router.push(`/plan?destination=${encodeURIComponent(destination)}&startDate=${startDate}&endDate=${endDate}&budgetMin=${budgetMin}&budgetMax=${budgetMax}`);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY as string,
    libraries: ['places'],
  });

  const [showLoadError, setShowLoadError] = useState(false);

  useEffect(() => {
    if (loadError) {
      const timer = setTimeout(() => {
        setShowLoadError(true);
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [loadError]);

  if (loadError) return <div>Error loading Google Maps. Please refresh the page.</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-6xl relative">
      <div className="bg-white rounded-lg md:rounded-full p-4 md:p-2">
        <form className="flex flex-col md:flex-row md:items-center" onSubmit={handleSubmit}>
          <div className="flex-1 px-0 md:px-5 mb-4 md:mb-0 relative">
            {showLoadError && (
              <div className="text-red-500 text-sm mb-2">
                Error loading Google Maps. Please refresh the page.
              </div>
            )}
            {isLoaded ? (
              <Autocomplete
                onPlaceChanged={() => {
                  const autocomplete = document.getElementById('destination') as HTMLInputElement;
                  if (autocomplete) {
                    const place = autocomplete.value;
                    setDestination(place);
                  }
                }}
              >
                <input
                  id="destination"
                  className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none border rounded-md md:border-none"
                  placeholder='Where to?'
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Autocomplete>
            ) : (
              <input
                id="destination"
                className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none border rounded-md md:border-none"
                placeholder='Where to?'
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            )}
          </div>
          <div className="flex-1 px-0 md:px-5 mb-4 md:mb-0 md:border-l md:border-r relative">
            <label htmlFor="dateRange" className="block text-lg font-bold text-gray-700 mb-1 md:hidden">Duration</label>
            <button
              id="dateRange"
              type="button"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-transparent text-left flex items-center border rounded-md md:border-none"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <Calendar className="w-5 h-5 mr-3 text-[#4A0E78]" />
              <span>{getDateRangeText()}</span>
            </button>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg rounded-lg w-full">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDateRange([{
                    startDate: item.selection.startDate ?? new Date(),
                    endDate: item.selection.endDate ?? new Date(),
                    key: 'selection'
                  }])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  className="w-full"
                  color="#4A0E78"
                  rangeColors={["#4A0E78"]}
                />
                <div className="p-4 bg-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {formatDate(dateRange[0].startDate)} - {formatDate(dateRange[0].endDate)}
                  </p>
                  <button
                    type="button"
                    className="bg-[#4A0E78] text-white px-4 py-2 rounded-md hover:bg-[#3A0B5E] focus:outline-none focus:ring-2 focus:ring-[#4A0E78] focus:ring-opacity-50"
                    onClick={handleSetDates}
                  >
                    Set Dates
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 px-0 md:px-5 mb-4 md:mb-0 relative">
            <label htmlFor="budget" className="block text-lg font-bold text-gray-700 mb-1 md:hidden">Budget</label>
            <button
              id="budget"
              type="button"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-transparent text-left flex items-center border rounded-md md:border-none"
              onClick={() => setShowBudget(!showBudget)}
            >
              <DollarSign className="w-5 h-5 mr-3 text-[#4A0E78]" />
              <span>Budget: ${budget[0]} - ${budget[1]}</span>
            </button>
            {showBudget && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg rounded-lg w-full p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Select Budget Range</h3>
                <Range
                  values={budget}
                  step={100}
                  min={0}
                  max={10000}
                  onChange={(values) => setBudget(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      className="h-4 flex w-full"
                      style={props.style}
                    >
                      <div
                        ref={props.ref}
                        className="h-1 w-full rounded-full self-center"
                        style={{
                          background: getTrackBackground({
                            values: budget,
                            colors: ["#ccc", "#4A0E78", "#ccc"],
                            min: 0,
                            max: 10000,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  )}
                  renderThumb={({ props, isDragged }) => (
                    <div
                      {...props}
                      className={`h-4 w-4 rounded-full bg-white shadow flex justify-center items-center ${
                        isDragged ? "ring-2 ring-[#4A0E78]" : ""
                      }`}
                      style={{
                        ...props.style,
                        boxShadow: "0px 2px 6px #AAA",
                      }}
                    >
                      <div className="h-2 w-2 bg-[#4A0E78] rounded-full" />
                    </div>
                  )}
                />
              </div>
            )}
          </div>
          <button
            className="bg-[#4A0E78] text-white rounded-md md:rounded-full p-3 md:p-4 hover:bg-[#3A0B5E] focus:outline-none focus:shadow-outline w-full md:w-auto"
            type="submit"
          >
            <Search className="w-6 h-6 mx-auto" />
            <span className="md:hidden ml-2">Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelPlannerForm;
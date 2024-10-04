'use client';

import { useState } from 'react';
import { Search, Calendar, DollarSign } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { Range, getTrackBackground } from 'react-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const TravelPlannerForm = () => {
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

  const handleBudgetChange = (newValues: number[]) => {
    setBudget(newValues);
  };

  return (
    <div className="w-full max-w-6xl relative">
      <div className="bg-white rounded-full p-2">
        <form className="flex items-center">
          <div className="flex-1 px-5">
            <input
              className="w-full py-2 text-gray-700 leading-tight focus:outline-none"
              placeholder='Where do you want to go?'
              type="text"
            />
          </div>
          <div className="flex-1 px-5 border-l border-r relative">
            <button
              type="button"
              className="w-full py-2 text-gray-700 leading-tight focus:outline-none bg-transparent text-left flex items-center"
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
          <div className="flex-1 px-5 relative">
            <button
              type="button"
              className="w-full py-2 text-gray-700 leading-tight focus:outline-none bg-transparent text-left flex items-center"
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
            className="bg-[#4A0E78] text-white rounded-full p-4 hover:bg-[#3A0B5E] focus:outline-none focus:shadow-outline"
            type="submit"
          >
            <Search className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelPlannerForm;
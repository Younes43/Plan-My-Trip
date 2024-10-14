# Journify AI - AI-Powered Travel Planner

Journify AI is an innovative travel planning application that leverages artificial intelligence to create personalized trip itineraries based on your budget and preferences. Integrated with OpenAI's powerful language model, Journify AI offers tailored travel recommendations, including accommodations, activities, and transportation options. Future integrations with Google Maps, booking platforms, and activity providers will further enhance the travel planning experience.

## Demo

<img src="demo_journey_ai.gif" alt="Journey AI Demo" width="1000"/>

## Features

- AI-powered trip planning
- Budget-based itinerary creation
- Personalized travel recommendations
- Integration with OpenAI
- Responsive design for various devices
- User-friendly interface

## Quick Start

To run Journey AI locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/Younes43/Plan-My-Trip.git
   cd Plan-My-Trip
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API

## Project Structure

The main components of the project are:

- `src/app/page.tsx`: The main landing page component
- `src/app/components/`: Directory containing all React components
- `src/app/api/generatePlan/route.tsx`: API route for generating travel plans

## Key Components

### TravelPlannerForm

This component allows users to input their travel preferences, including destination, date range, and budget.

### TripPlan

This component displays the generated travel itinerary, including daily activities, accommodations, and transportation options.

## API Integration

The application integrates with OpenAI's API to generate travel plans based on user input.

## Styling

The project uses Tailwind CSS for styling, with global styles defined in `src/app/globals.css`.

## Contributing

Contributions to Journey AI are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Future Enhancements

- Integration with Google Maps for location-based services
- Connecting with booking platforms for real-time availability and pricing
- Incorporating activity providers for seamless experience booking
- User authentication and profile management
- Saving and sharing travel plans

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function logRequest(requestData: any, responseData: any, success: boolean, statusCode: number) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      request: requestData,
      response: responseData,
      success,
      statusCode,
    };
  
    const logFilePath = path.join(process.cwd(), 'logs', 'requests.json');
  
    try {
      await fs.mkdir(path.dirname(logFilePath), { recursive: true });
      
      let existingLogs = [];
      try {
        const fileContent = await fs.readFile(logFilePath, 'utf-8');
        existingLogs = JSON.parse(fileContent);
      } catch (error) {
        // File doesn't exist or is empty, start with an empty array
      }
  
      existingLogs.push(logEntry);
  
      await fs.writeFile(logFilePath, JSON.stringify(existingLogs, null, 2));
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  export async function POST(request: Request) {
    const { destination, startDate, endDate, budget } = await request.json();
  
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful travel planner assistant. Provide detailed day-by-day itineraries including accommodations, activities, and transportation. Format your response as a JSON object with the following structure:
            {
              "days": [
                {
                  "day": 1,
                  "date": "YYYY-MM-DD",
                  "activities": [
                    {
                      "time": "HH:MM",
                      "description": "Activity description",
                      "location": "Location name"
                    }
                  ],
                  "accommodation": {
                    "name": "Accommodation name",
                    "type": "Hotel/Hostel/Airbnb"
                  },
                  "transportation": "Transportation method for the day"
                }
              ]
            }`
          },
          {
            role: "user",
            content: `Create a detailed travel plan for a trip to ${destination} from ${startDate} to ${endDate} with a ${budget} budget. Include specific daily activities, recommended accommodations, and transportation options.`
          }
        ],
      });
  
      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No content in completion");
      const plan = JSON.parse(content);
      
      await logRequest(
        { destination, startDate, endDate, budget },
        { plan },
        true,
        200
      );
  
      return NextResponse.json({ plan });
    } catch (error) {
      console.error('Error generating travel plan:', error);
      
      await logRequest(
        { destination, startDate, endDate, budget },
        { error: 'Error generating travel plan' },
        false,
        500
      );
  
      return NextResponse.json({ error: 'Error generating travel plan' }, { status: 500 });
    }
  }
import { GoogleGenerativeAI, } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// convert messages from the Vercel AI SDK Format to the format


export async function POST(req: Request) {
    try {

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single  string(keep this in mind). Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me , and should be suitable for a diverse audience, Avoid personal or sensitive topics , focusing instead on universal themes that encourage firendly intereaction. For example, your output should be structured like this : ' what's a hobby you've recently started? || If you could have dinner with any historical figure , who would it be ? || what's a simple thing that makes you happy? '. Ensure the questions are intriguing , foster curiosity , and contribute to a positive and welcoming conversational environment . Response should be as a single string separated by || don't add any other lines "

        const geminiStream = await genAI
            .getGenerativeModel({ model: 'gemini-pro' })
            .generateContentStream(prompt);

        // Convert the response into a friendly text-stream
        const stream = GoogleGenerativeAIStream(geminiStream);

        // Respond with the stream
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error("An unexpected error occured");
        // throw error
        return Response.json({
            success: false,
            message: "gemini api error",
        }, { status: 500 })
    }
}
import { openai } from '@ai-sdk/openai';
import { streamText, APICallError } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: NextRequest) {
    try {
        const openaiApiKey = process.env.OPENAI_API_KEY;
        if (!openaiApiKey) {
            throw new Error('Missing OPENAI_API_KEY');
        }

        const prompt = `
        Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
        `

        const result = await streamText({
            model: openai('gpt-4-turbo'),
            maxTokens: 100,
            prompt,
        });

        //NOTE - convert to core messages and return them as data stream
        return result.toDataStreamResponse();

    } catch (error) {
        if (error instanceof APICallError) {
            const { url, requestBodyValues, statusCode, responseHeaders, responseBody, cause, isRetryable, data } = error;
            return NextResponse.json(
                {
                    url,
                    requestBodyValues,
                    responseHeaders,
                    responseBody,
                    cause,
                    isRetryable,
                    data
                },
                { status: statusCode || 500 }
            );
        } else {
            console.log('An error occurred:', error)
            return NextResponse.json(
                {
                    success: false,
                    message: 'An error occurred'
                },
                { status: 500 }
            )
        }
    }
}
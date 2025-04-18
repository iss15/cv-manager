import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';

@Controller('smolagent')
export class SmolAgentController {
  @Post('interact')
  async interact(@Body() body: { conversation: Array<{ sender: string; text: string }> }): Promise<string> {
    const { conversation } = body;

    // Format the conversation history into a single string
    const formattedConversation = conversation
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'SmolAgent'}: ${msg.text}`)
      .join('\n'); 
    const apiUrl = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

    try {
      const response = await axios.post(
        apiUrl,
        { inputs: formattedConversation }, // Send the formatted conversation
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          },
        },
      );

      const data = response.data as Array<{ generated_text?: string }>;
      const generatedText = data[0]?.generated_text;

      return generatedText || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Error interacting with SmolAgent:', error);
      throw new Error('Failed to interact with SmolAgent.');
    }
  }
}
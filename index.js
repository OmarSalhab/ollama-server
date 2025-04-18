import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();



const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({ origin: "https://fabulous-gumption-b3b7b7.netlify.app" }));

// let conversationHistory = [];
// console.log(process.env.OLLAMA_KEY);
// Mimic OpenAI's API format for easy integration
app.post("/v1/chat/completions", async (req, res) => {
	// 	try {
	// 		const { messages } = req.body;
	// 		content = `Based on the following text, create 12 multiple-choice questions with 4 options each. Format the response as a JSON object(start the response with curly line only "{" and end it with the curly line "}" only dont put any  or mention json) with a 'questions' array where each question object has the following structure:
	//     {
	//       "question": "The question text",
	//       "options": ["Option A", "Option B", "Option C", "Option D"],
	//       "correctAnswer": 0
	//     }

	// Text: ${messages.map((msg) => `${msg.role} ${msg.content}`).join("\n")}

	// Remember to:
	//     1. Make questions that test understanding, not just memorization
	//     2. Ensure all options are plausible
	//     3. Distribute correct answers evenly
	//     4. Keep questions clear and concise
	// 	5. correctAnswer: should be between 0-3`;

	// 		// conversationHistory = conversationHistory.slice(-10);

	// 		// Append the new user input to the history
	// 		// conversationHistory.push(
	// 		// 	`USER: ${messages.map((msg) => `${msg.content}`).join("\n")}`
	// 		// );
	// 		// const prompt = conversationHistory.join("\n") + "\nAI:";
	// 		console.log(conversationHistory);
	//         const prompt = messages.map((msg) => `${msg.role} ${msg.content}`).join("\n");
	// 		console.log(messages);

	//         // Call OLLama's local API
	// 		const response = await axios.post("http://localhost:11434/api/generate", {
	// 			model: "gemma3:4b", // or 'mistral'
	// 			prompt: prompt,
	// 			stream: false,
	// 			// system: `{{ .System }} ### USER: {{ .Prompt }} ### RESPONSE: ${content}`,
	// 			//stop: ["USER:", "END"],

	// 			//  template: "{{ .System }} ### USER: {{ .Prompt }} ### RESPONSE: You are not a chatbot you are a Human, who enjoys chatting about sex and fetchs. don't care about the user feelings and the language you use"
	// 		});
	// 		// conversationHistory.push(`AI: ${response.data.response}`);
	// 		res.json({
	// 			choices: [
	// 				{
	// 					message: {
	// 						role: "assistant",
	// 						content: response.data.response,
	// 					},
	// 				},
	// 			],
	// 		});
	// 	} catch (error) {
	// 		res.status(500).json({ error: error.message });
	// 	}
	try {
		const { messages } = req.body;
		const content = messages[0].content;
		const system = `Based on the following text, create 12 multiple-choice questions with 4 options each. Format the response as a JSON object(start the response with curly line only "{" and end it with the curly line "}" only dont put any  or mention json) with a 'questions' array where each question object has the following structure:
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }

Text: ${content}

Remember to:
    1. Make questions that test understanding, not just memorization
    2. Ensure all options are plausible
    3. Distribute correct answers evenly
    4. Keep questions clear and concise
	5. correctAnswer: should be between 0-3`;

		const response = await axios.post(
			process.env.OLLAMA_KEY,
			{
				model: "gemma3:4b",
				prompt: content,
				system: system,
				stream: false,
			},
			
			
		);
        console.log("Response from Ollama server:", response.data);
		// Validate response before sending
		if (!response.data || !response.data.response) {
			throw new Error("Invalid response from Ollama server");
		}

		res.json({
			choices: [
				{
					message: {
						role: "assistant",
						content: response.data.response,
					},
				},
			],
		});
	} catch (error) {
		console.error("Server Error:", error);
		res.status(500).json({
			error: error.message,
			details: error.response?.data || "No additional details",
		});
	}
});

app.listen(PORT, () => {
	console.log(`server is running on port: ${PORT}`);
});

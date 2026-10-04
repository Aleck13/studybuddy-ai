import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

app.post("/api/study", async (req, res) => {
    const { topic, subject } = req.body;

    if (!topic || !topic.trim()) {
        return res.status(400).json({
            error: "Inserisci un argomento da studiare."
        });
    }

    try {
        const response = await client.responses.create({
            model: "gpt-6-luna",
            input: `
Sei StudyBuddy, un tutor scolastico amichevole.

Aiuta uno studente di scuola media a capire un argomento.

Materia: ${subject || "non specificata"}
Argomento: ${topic}

Spiega in modo:
- semplice
- chiaro
- adatto a uno studente di 13 anni
- con esempi
- senza parole troppo difficili senza spiegarle

Organizza la risposta così:

📚 SPIEGAZIONE
Spiega l'argomento.

💡 ESEMPIO
Fai un esempio semplice.

🧠 COSA RICORDARE
Elenca le cose più importanti.

❓ MINI QUIZ
Fai una domanda per verificare se lo studente ha capito.

Non limitarti a dare una definizione.
Devi aiutare lo studente a imparare davvero.
`
        });

        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Errore durante la comunicazione con l'AI."
        });
    }
});

export default app;
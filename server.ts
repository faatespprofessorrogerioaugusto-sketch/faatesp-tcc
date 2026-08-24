import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client safely
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY || "";
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API Route: AI Spelling, Grammar and Academic Correction per Section
  app.post("/api/generate-draft", async (req, res) => {
    try {
      const { sectionTitle, guidelines, currentText, workType, topic } = req.body;

      const ai = getAiClient();

      const systemInstruction = `Você é um revisor gramatical, ortográfico e especialista em normas ABNT para Trabalhos de Conclusão de Curso (TCC), Monografias e Dissertações no Brasil.
Sua missão é realizar a CORREÇÃO ORTOGRÁFICA E GRAMATICAL minuciosa e o aprimoramento da linguagem para a seção "${sectionTitle || 'Desenvolvimento'}" do trabalho sobre "${topic || 'Tema Acadêmico'}".

Regras Estritas de Correção e Redação Acadêmica:
1. Corrija rigorosamente todos os erros de ortografia, acentuação, pontuação, crase, concordância verbal e nominal no Português do Brasil.
2. Mantenha ou converta a redação estritamente em TERCEIRA PESSOA (linguagem impessoal: "observa-se", "constata-se", "pretende-se").
3. Mantenha tom científico, formal, claro, coeso e fluido.
4. Se houver um texto atual do capítulo fornecido pelo usuário, utilize-o como base principal para correção e refinamento.
5. Se o usuário fornecer instruções adicionais de correção ("${guidelines}"), aplique-as com máxima fidelidade.
6. Forneça como resposta APENAS o texto final totalmente corrigido e pronto para uso, sem saudações ou comentários conversacionais.`;

      const prompt = `Trabalho: ${workType || 'TCC / Monografia'}
Seção / Capítulo: ${sectionTitle || 'Capítulo'}
Tema Geral: ${topic || 'Não especificado'}
${currentText ? `Texto Atual a ser Corrigido:\n"""\n${currentText}\n"""\n` : ''}
Instruções de Correção:
"${guidelines || 'Realizar correção ortográfica e gramatical completa mantendo o padrão culto ABNT.'}"

Por favor, forneça o texto final completamente corrigido no padrão culto ABNT:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const draftText = response.text || "";

      res.json({ draft: draftText });
    } catch (error: any) {
      console.error("Erro na correção ortográfica e gramatical:", error);
      res.status(500).json({
        error: "Erro ao executar correção ortográfica e gramatical com IA. Verifique se a chave de API está disponível e tente novamente.",
        details: error?.message || String(error),
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TCC Maker Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

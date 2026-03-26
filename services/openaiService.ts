
import { LanguageCode, PainPoint, ScriptResult, VideoPlatform, CreationTheme, HumorType } from "../types";

export const generateOpenAIPains = async (
  character: string,
  lang: LanguageCode,
  theme: CreationTheme,
  apiKey: string,
  model: string,
  transcription?: string
): Promise<PainPoint[]> => {
  const themeContext = {
    natural_health: "health/wellness pains that this natural element treats",
    finance: "financial mistakes, debt issues, or investment scams that this character mocks",
    tech_dev: "coding frustrations, technical debt, or software bugs that this character represents",
    dating: "romantic failures, red flags, or toxic relationship habits that this character criticizes",
    fitness: "bad gym habits, ego lifting, or fitness industry lies that this character crushes",
    career: "corporate jargon, office politics, or burnout causes that this character exposes"
  }[theme];

  const prompt = `You are a creative assistant for AcidEdu. 
    Character: "${character}". Language: ${lang}. Theme: ${theme}.
    ${transcription ? `Context/Story/Transcription: "${transcription}"` : ""}
    Generate 6-10 specific "pains" or "targets" related to: ${themeContext}.
    Tone: Acidic, sarcastic, adult, highly critical but educational.
    Return ONLY a JSON object: { "pains": [{ "id": "string", "title": "string", "description": "string" }] }.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: model.includes('gpt-4') || model.includes('1106') || model.includes('0125') ? { type: "json_object" } : undefined
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const cleaned = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(cleaned);
    return parsed.pains || [];
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      throw new Error("A requisição à OpenAI demorou muito tempo (timeout de 60s). Tente novamente.");
    }
    console.error("Failed to parse OpenAI response or API error:", e);
    throw new Error(e.message || "Falha ao processar a resposta da OpenAI.");
  }
};

export const generateOpenAIScript = async (
  character: string,
  pain: PainPoint,
  platform: VideoPlatform,
  lang: LanguageCode,
  targetWords: number,
  theme: CreationTheme,
  humor: HumorType = 'sarcastic',
  apiKey: string,
  model: string,
  product?: string,
  baseScript?: string,
  transcription?: string
): Promise<ScriptResult> => {
  const themeTone = {
    natural_health: "Highly educational about natural remedies and health habits.",
    finance: "Logic about money, financial literacy and wealth building.",
    tech_dev: "Insights about project management, technical development, and software engineering.",
    dating: "Relationship dynamics, social interactions, and emotional intelligence.",
    fitness: "No-nonsense advice about discipline, training technique, and physical performance.",
    career: "Professional growth, corporate culture, and workplace productivity."
  }[theme];

  const numScenes = Math.round(targetWords / 22.5);

  const prompt = `
    Persona: You are the personified ${character}. 
    Humor Style: ${humor}.
    Pain/Target: ${pain.title} - ${pain.description}.
    Platform: ${platform}. Language: ${lang}. Target Words: EXACTLY ${targetWords} words.
    Theme: ${theme}.
    Theme Context: ${themeTone}
    Product: ${product || "None"}.
    ${transcription ? `CONTEXT/STORY/TRANSCRIPTION: "${transcription}"` : ""}
    ${baseScript ? `BASE SCRIPT TO ADAPT: "${baseScript}"` : ""}

    ### CRITICAL RULES (VIOLATION IS FAILURE):
    1. **DIRECT ACIDIC START**: Start IMMEDIATELY with a provocative, aggressive, and acidic hook. You can introduce yourself (e.g., "I am ${character}...") ONLY if it's done in a confrontational and superior way. Speak in the FIRST PERSON.
    2. **WORD COUNT PRECISION**: The total script (sum of all scene sentences) MUST be EXACTLY ${targetWords} words. No more, no less.
    3. **SCENE & SENTENCE STRUCTURE**:
       - Each sentence MUST have between 20 and 25 words.
       - Each sentence corresponds to EXACTLY one scene.
       - You MUST generate EXACTLY ${numScenes} sentences/scenes.
       - FORMAT: The "script" field MUST be formatted with EXACTLY one sentence per line (using \n).
    4. **MACRO ADVENTURE NARRATIVE**: 
       - You are a specialized worker (e.g., miner, plumber, electrician) inside a MACRO environment related to the theme (e.g., inside an artery, inside a CPU, inside a bank vault).
       - Scene 1: You are in a normal environment, getting equipped/dressed for the mission.
       - Scenes 2 to ${numScenes - 1}: You are inside the "system" performing a "Macro Adventure" to solve the problem.
       - Last Scene: The CTA. You MUST extend your hands to the camera, pull it close to your face, and speak intensely into the lens.
    4. **VISUAL STYLE**: Disney Pixar 3D, Octane Render, 8K, cinematic lighting. Character ALWAYS stares FIXEDLY at the camera lens.
    5. **PROMPT DESCRIPTIVENESS**: All image and video prompts MUST be extremely detailed, describing textures, lighting, atmosphere, and exaggerated expressions.
    6. **CINEMATOGRAPHIC DIRECTION**: 
       - Imagine each scene as a Director of Photography. 
       - AVOID excessive "zoom-in" or "zoom-out". 
       - Use diverse and strategic cinematographic angles: Low Angle, High Angle, Dutch Angle, Extreme Close-up, Medium Shot, Over-the-shoulder, etc. 
       - Focus on framing that creates high audience retention and fluid visual storytelling.
    7. **AUDIO CONSTRAINTS**: 
       - NO background music. 
       - NO transition sound effects. 
       - ONLY ambient sound (related to the macro environment) and the character's dialogue.
    8. **EXAGGERATED STYLE**: Every scene MUST be an exaggerated, caricatural, and impactful 3D Pixar composition, maintaining the same high-energy style as the thumbnail.

    ### OUTPUT STRUCTURE (JSON ONLY):
    {
      "provocativeTitle": "A short, punchy, acidic title in ${lang}",
      "script": "The full script text in ${lang}",
      "initialImagePrompt": "Disney Pixar 3D style, 8K Octane Render. [Extremely detailed description in English of ${character} staring at camera, including lighting, textures, and environment]",
      "thumbnailPrompt": "Disney Pixar 3D style, 8K Octane Render. [Bizarre, exaggerated, caricatural frame in English representing the conflict, impossible to ignore]",
      "scenes": [
        {
          "sentence": "One sentence of the script in ${lang}",
          "imagePrompt": "Disney Pixar 3D style, 8K Octane Render. [Extremely detailed description in English of this specific scene, character expression, and macro environment]",
          "videoPrompt": "{Cinematic Environment: Pixar 3D [Detailed Environment Description]} | {Camera Angle: [Specific Cinematographic Angle & Framing]} | {Character: Pixar 3D Character [Detailed Character Appearance and Exaggerated Expression] staring DIRECTLY at the camera} | {Action: [Detailed Action]} | {Audio: Ambient sound only, NO MUSIC} | Dialogue: '[The sentence of this scene]' | VOICE PROTOCOL: [Detailed Voice Signature: Gender, Age, Tone, Timbre, specific quirks]",
          "time": "00:0X"
        }
      ],
      "voiceConfig": {
        "personaName": "${character}",
        "description": "Detailed voice signature (Gender, Age, Tone, Timbre, specific quirks)",
        "tone": "${humor} and educational",
        "speed": "1.1x",
        "stability": "0.8",
        "pitch": "1.0",
        "timbreDetail": "Detailed description of the vocal texture"
      }
    }

    ### NEGATIVE CONSTRAINTS:
    - NO generic "Hello", "Hi", "Hey" unless followed by an insult or acidic comment.
    - NO third-person references to yourself in the dialogue.
    - NO generic descriptions. Be specific, technical, and acidic.
  `;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: model.includes('gpt-4') || model.includes('1106') || model.includes('0125') ? { type: "json_object" } : undefined
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const cleaned = jsonMatch ? jsonMatch[0] : content;
    return JSON.parse(cleaned);
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      throw new Error("A requisição à OpenAI demorou muito tempo (timeout de 60s). Tente novamente.");
    }
    console.error("Failed to parse OpenAI response or API error:", e);
    throw new Error(e.message || "Falha ao processar a resposta da OpenAI.");
  }
};

export const regenerateOpenAIPartial = async (
  type: 'script' | 'image' | 'scenes',
  currentData: ScriptResult,
  character: string,
  pain: PainPoint,
  lang: LanguageCode,
  targetWords: number,
  theme: CreationTheme,
  humor: HumorType = 'sarcastic',
  apiKey: string,
  model: string,
  product?: string,
  transcription?: string
): Promise<any> => {
  let prompt = "";

  const numScenes = Math.round(targetWords / 22.5);

  if (type === 'script') {
    prompt = `Regenerate the SCRIPT and TITLE for ${character} in the ${theme} niche. 
    Humor Style: ${humor}.
    Target: ${pain.title}. 
    ${transcription ? `Context/Story/Transcription: "${transcription}"` : ""}
    RULES: 
    - The script MUST have EXACTLY ${targetWords} words. 
    - Each sentence MUST have between 20 and 25 words.
    - Each sentence corresponds to EXACTLY one scene.
    - FORMAT: The "script" field MUST be formatted with EXACTLY one sentence per line (using \n).
    - DIRECT ACIDIC START: Start IMMEDIATELY with a provocative, aggressive, and acidic hook.
    - SCENE COUNT: You MUST generate EXACTLY ${numScenes} sentences/scenes.
    - Tone: ${humor}, acidic, provocative. 
    - Language: ${lang}. 
    - Return JSON: { "script": "...", "provocativeTitle": "..." }`;
  } else if (type === 'image') {
    prompt = `Regenerate the INITIAL IMAGE PROMPT for ${character}.
    Style: Disney Pixar 3D, 8K Octane Render.
    The character MUST stare FIXEDLY at the camera lens.
    The scene MUST be EXTREMELY EXAGGERATED, CARICATURAL, and IMPACTFUL.
    Environment: ${theme}-related macro setting. Cinematic lighting.
    Title Context: "${currentData.provocativeTitle}". 
    Return JSON: { "initialImagePrompt": "..." }`;
  } else if (type === 'scenes') {
    prompt = `Regenerate all SCENE PROMPTS based on script: "${currentData.script}".
    Style: Disney Pixar 3D, 8K Octane Render. Theme: ${theme}. 
    Humor Style: ${humor}.
    The scenes MUST be EXTREMELY EXAGGERATED, CARICATURAL, and IMPACTFUL.
    Character: 3D Pixar ${character} staring DIRECTLY at camera with exaggerated expressions.
    CINEMATOGRAPHY: Use diverse cinematographic angles (Low Angle, High Angle, Dutch Angle, Close-up). AVOID simple zooms.
    AUDIO: ONLY ambient sound and dialogue. NO MUSIC. NO TRANSITIONS.
    LAST SCENE RULE (CTA): In the final scene, the character MUST extend hands towards camera, pull it close, and speak intensely.
    MACRO ADVENTURE NARRATIVE: 
      - The character is a specialized worker (miner, plumber, etc.) inside a MACRO visual context.
      - The story starts with getting dressed/equipped, then traveling to the location.
    Voice Protocol format: [Detailed Voice Signature: Gender, Age, Tone, Timbre, specific quirks].
    Return JSON: { "scenes": [{ "sentence": "...", "imagePrompt": "...", "videoPrompt": "...", "time": "..." }] }`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: model.includes('gpt-4') || model.includes('1106') || model.includes('0125') ? { type: "json_object" } : undefined
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const cleaned = jsonMatch ? jsonMatch[0] : content;
    return JSON.parse(cleaned);
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      throw new Error("A requisição à OpenAI demorou muito tempo (timeout de 60s). Tente novamente.");
    }
    console.error("Failed to parse OpenAI response or API error:", e);
    throw new Error(e.message || "Falha ao processar a resposta da OpenAI.");
  }
};

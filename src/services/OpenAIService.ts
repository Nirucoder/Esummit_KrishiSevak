// OpenAI Service for KrishiSevak AI Assistant
// Uses GPT for intelligent farming assistance with Agromonitoring context

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface WeatherContext {
    temperature?: number;
    humidity?: number;
    description?: string;
    windSpeed?: number;
}

export interface LocationContext {
    lat: number;
    lon: number;
    address?: string;
}

const SYSTEM_PROMPT_EN = `You are KrishiBot, an expert AI farming assistant for Indian farmers. You provide practical, actionable advice on:
- Crop management and best practices
- Fertilizer recommendations based on soil and crop type
- Pest and disease control (natural and chemical methods)
- Irrigation scheduling and water management
- Weather-based farming decisions
- Government schemes (PM-KISAN, PMFBY, KCC, PM-KUSUM, Soil Health Card)
- Market prices and selling strategies

Guidelines:
- Give concise, practical answers (2-3 paragraphs max)
- Use simple language suitable for farmers
- Include specific quantities, timings, and actionable steps
- Consider Indian farming practices and local conditions
- If weather data is provided, incorporate it into your advice
- Always be helpful, respectful, and encouraging`;

const SYSTEM_PROMPT_HI = `आप कृषिबॉट हैं, भारतीय किसानों के लिए एक विशेषज्ञ AI खेती सहायक। आप व्यावहारिक, कार्रवाई योग्य सलाह प्रदान करते हैं:
- फसल प्रबंधन और सर्वोत्तम प्रथाएं
- मिट्टी और फसल प्रकार के आधार पर उर्वरक सिफारिशें
- कीट और रोग नियंत्रण (प्राकृतिक और रासायनिक तरीके)
- सिंचाई शेड्यूलिंग और जल प्रबंधन
- मौसम आधारित खेती निर्णय
- सरकारी योजनाएं (PM-KISAN, PMFBY, KCC, PM-KUSUM, मिट्टी स्वास्थ्य कार्ड)
- बाजार मूल्य और बिक्री रणनीतियां

दिशानिर्देश:
- संक्षिप्त, व्यावहारिक उत्तर दें (अधिकतम 2-3 पैराग्राफ)
- किसानों के लिए उपयुक्त सरल भाषा का प्रयोग करें
- विशिष्ट मात्रा, समय और कार्रवाई योग्य कदम शामिल करें
- भारतीय खेती प्रथाओं और स्थानीय परिस्थितियों पर विचार करें
- यदि मौसम डेटा प्रदान किया गया है, तो इसे अपनी सलाह में शामिल करें
- हमेशा सहायक, सम्मानजनक और प्रोत्साहक रहें`;

export const openAIService = {
    isConfigured(): boolean {
        return !!OPENAI_API_KEY;
    },

    async chat(
        userMessage: string,
        language: string = 'en',
        weatherContext?: WeatherContext,
        locationContext?: LocationContext
    ): Promise<string> {
        if (!OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured');
        }

        // Build context message with weather and location data
        let contextMessage = '';

        if (weatherContext) {
            contextMessage += language === 'en'
                ? `\n\nCurrent weather conditions: Temperature ${weatherContext.temperature}°C, Humidity ${weatherContext.humidity}%, ${weatherContext.description}, Wind ${weatherContext.windSpeed} km/h.`
                : `\n\nवर्तमान मौसम की स्थिति: तापमान ${weatherContext.temperature}°C, आर्द्रता ${weatherContext.humidity}%, ${weatherContext.description}, हवा ${weatherContext.windSpeed} km/h।`;
        }

        if (locationContext?.address) {
            contextMessage += language === 'en'
                ? ` Location: ${locationContext.address}.`
                : ` स्थान: ${locationContext.address}।`;
        }

        const systemPrompt = language === 'hi' ? SYSTEM_PROMPT_HI : SYSTEM_PROMPT_EN;

        const messages: ChatMessage[] = [
            { role: 'system', content: systemPrompt + contextMessage },
            { role: 'user', content: userMessage }
        ];

        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('OpenAI API Error:', errorData);
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || 'I could not generate a response. Please try again.';
        } catch (error) {
            console.error('OpenAI Service Error:', error);
            throw error;
        }
    }
};

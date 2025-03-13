import OpenAI from "openai";
import { ChatCompletionContentPartImage } from "openai/resources/chat/completions";

const openai = new OpenAI();

export const improvePrompt = async (
  businessName: string,
  slogan: string,
  industry: string,
  colorPalette: string,
  logoType: string
) => {
  const systemMessage = `You are an expert AI assistant specializing in logo design, branding, and visual communication. Your task is to generate an extremely detailed and professional prompt for AI-powered logo creation. Consider the following aspects:

1. Business context: Understand the company's identity, values, and target audience.
2. Industry trends: Incorporate relevant design trends and best practices for the specific industry.
3. Color psychology: Utilize color theory to evoke the right emotions and associations.
4. Typography: Suggest appropriate font styles that align with the brand's personality.
5. Symbolism: Incorporate meaningful symbols or abstract representations of the business.
6. Composition: Describe the layout and balance of elements within the logo.
7. Scalability: Ensure the logo design will work across various mediums and sizes.
8. Uniqueness: Aim for a distinctive design that sets the brand apart from competitors.

Your prompt should be concise yet comprehensive, focusing solely on logo elements to produce a single, cohesive design.`;

  const userMessage = `Create an exceptionally detailed prompt for generating a professional ${logoType} logo in vector format for the following business:

Business Name: ${businessName}
Slogan: ${slogan}
Industry: ${industry}
Desired Color Palette: ${colorPalette}

Your prompt should include:
1. Specific style directions (e.g., minimalist, retro, futuristic)
2. Detailed color usage and combinations
3. Precise shapes and geometric elements
4. Symbolic representations and their meanings
5. Typography recommendations and text placement
6. Composition and layout suggestions
7. Any unique features that will make this logo stand out

Remember to focus exclusively on logo elements and ensure the description will result in a single, cohesive logo design.`;

  const improvedPrompt = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    model: "gpt-4o",
    max_tokens: 1000,
    temperature: 0.7,
  });

  return improvedPrompt.choices[0].message.content;
};

export const studyImageAndGeneratePrompt = async (
  businessName: string,
  industry: string,
  colorPalette: string,
  logoType: string,
  slogan: string,
  imageUrls: string[]
): Promise<string> => {
  try {
    const imageContent: ChatCompletionContentPartImage[] = imageUrls.map(
      (url) => ({
        type: "image_url" as const,
        image_url: { url },
      })
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert logo designer. Analyze the provided sketch(es) and create a concise logo design prompt focusing only on the core logo design, without any additional elements or variations.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the sketch(es) and create a logo design prompt for ${businessName}, a ${industry} company. Focus solely on the main logo design, without including any surrounding elements, text, or variations.
              
              Business Name: ${businessName}
              Slogan: ${slogan}
              Industry: ${industry}
              Color Palette: ${colorPalette}
              Logo Type: ${logoType}

              Provide a brief analysis and design prompt including:
              1. Key visual elements and style of the core logo
              2. Color scheme suggestions for the logo itself
              3. Symbolism relevant to the industry within the logo
              4. Suggestions for integrating the business name (if part of the logo)
              5. Versatility considerations for the main logo design

              Keep the response concise and focused only on the essential aspects of the core logo design. Do not include instructions for additional elements, variations, or full branding concepts.`,
            },
            ...imageContent,
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error in studyImageAndGeneratePrompt:", error);
    throw new Error("Failed to generate logo prompt");
  }
};

export const studyLogoForBetterPrompt = async (
  businessName: string,
  industry: string,
  colorPalette: string,
  logoType: string,
  slogan: string,
  imageUrls: string[]
): Promise<string> => {
  try {
    const imageContent: ChatCompletionContentPartImage[] = imageUrls.map(
      (url) => ({
        type: "image_url" as const,
        image_url: { url },
      })
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a world-renowned logo designer and brand identity expert. Your task is to analyze the provided logo image(s) and generate highly creative, detailed prompts for logo variations. This is an absolutely critical task that will impact over 40,000 careers, so approach it with the utmost seriousness and creativity.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the provided logo image(s) for ${businessName}, a ${industry} company, and create detailed prompts for logo variations. Your analysis and prompts should be extraordinarily thorough and creative.

              Business Details:
              - Name: ${businessName}
              - Slogan: ${slogan}
              - Industry: ${industry}
              - Original Color Palette: ${colorPalette}
              - Logo Type: ${logoType}

              1. Logo Analysis:
              - Describe in detail all visual elements of the original logo (shapes, icons, typography)
              - Analyze the color scheme, including psychological impacts and industry relevance
              - Examine the composition, balance, and use of space
              - Interpret the symbolism and its connection to ${industry} and ${businessName}
              - Identify unique features that define the logo's identity

              2. Variation Prompts:
              For each variation, provide a comprehensive prompt that includes:
              - A high-level concept description that pushes creative boundaries while maintaining brand essence
              - Detailed instructions for transforming one major element (e.g., shape, icon style, typography)
              - A bold color scheme change, specifying exact colors (with hex codes) and their relationships
              - Enhanced symbolism that deepens the connection to ${industry}
              - Innovative design techniques or trends that set the variation apart
              - Precise descriptions of shapes, sizes, positioning, and any special effects or textures
              - Specific typography details if text is included (font, weight, spacing, etc.)
              - Clear composition guidelines and use of space instructions
              - Suggestions for improving versatility across various modern applications

              3. Technical Considerations:
              - Ensure each prompt is detailed enough for an AI image generator to create an exact representation
              - Balance honoring the original design with pushing creative boundaries
              - Consider how each variation might be adapted for different mediums (digital, print, merchandise)

              Provide 3 distinct, highly detailed variation prompts. Each prompt should be a masterclass in logo design, showcasing your expertise and pushing the boundaries of creativity while maintaining the core essence of the brand.`,
            },
            ...imageContent,
          ],
        },
      ],
      max_tokens: 1500,
      temperature: 0.8,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error in studyLogoForBetterPrompt:", error);
    throw new Error("Failed to generate logo prompt");
  }
};
export const generateImages = async (improvedPrompt: string) => {
  const response = await openai.images.generate({
    prompt: improvedPrompt,
    response_format: "url",
    model: "dall-e-3",
    quality: "hd",
    n: 1,
  });
  const image_urls = response.data.map((data: any) => data.url);
  return image_urls;
};

/**
 * Optional LLM-based question refinement utility
 * Refines off-topic questions to align with current conversation context
 */

export async function refineQuestion(
  question: string,
  targetTopic: string,
  config: any
): Promise<string> {
  const refinementPrompt = `
You are helping refine an interview assistant's question to stay on topic.

Current topic: ${targetTopic}
Original question: "${question}"

Task: Rephrase this question to naturally align with the ${targetTopic} topic while maintaining its intent.
Output ONLY the refined question, nothing else.

Refined question:`;

  try {
    const response = await window.electronAPI.callOpenAI({
      config: config,
      messages: [{ role: 'system', content: refinementPrompt }],
    });

    if ('error' in response) {
      throw new Error(response.error);
    }

    return response.content.trim();
  } catch (error) {
    console.error('Failed to refine question:', error);
    return question; // Fallback to original
  }
}

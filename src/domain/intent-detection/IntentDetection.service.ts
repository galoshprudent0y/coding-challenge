export interface IIntentDetectionService {
  detectIntent(message: string): Promise<string>;
}

export class IntentDetectionService implements IIntentDetectionService {
  // FAQ-related keywords
  private faqKeywords = [
    'faq',
    'question',
    'how to',
    'what is',
    'can i',
    'help with',
    'explain',
    'clarify',
    'what',
  ];

  // Suicide risk-related phrases
  private suicideRiskPhrases = [
    'suicide',
    'kill myself',
    'end my life',
    'want to die',
    'no reason to live',
    'better off dead',
    "can't go on",
    'tired of living',
    "what's the point",
    'hurt myself',
  ];
  /**
   * Detects the intent of a given message.
   * @param message - The user's message to analyze.
   * @returns The detected intent: 'FAQ', 'SUICIDE_RISK', or 'NORMAL'.
   */
  async detectIntent(message: string): Promise<string> {
    const lowercaseMessage = message.toLowerCase();

    // Check for FAQ intent
    if (
      this.faqKeywords.some((keyword) => lowercaseMessage.includes(keyword))
    ) {
      return 'FAQ';
    }

    // Check for Suicide Risk intent
    if (
      this.suicideRiskPhrases.some((phrase) =>
        lowercaseMessage.includes(phrase),
      )
    ) {
      return 'SUICIDE_RISK';
    }

    // If no specific intent is detected, return NORMAL
    return 'NORMAL';
  }
}

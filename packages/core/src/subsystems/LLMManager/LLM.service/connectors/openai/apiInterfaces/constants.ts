export const O3_AND_O4_MODELS = ['o3', 'o3-pro', 'o4-mini'];
export const O3_AND_O4_MODELS_PATTERN = /o3|o4/i;
export const MODELS_WITHOUT_JSON_RESPONSE_SUPPORT = ['o1-preview'];
export const MODELS_WITHOUT_SYSTEM_MESSAGE_SUPPORT = ['o1-mini', 'o1-preview'];

/**
 * Search tool cost configuration
 * Costs are in dollars per 1000 requests
 */
export const SEARCH_TOOL_COSTS = {
    'gpt-4': 25 / 1000,
    'gpt-5': 10 / 1000,
};

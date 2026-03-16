import trainingContent from '../../DB/ass-plug.json';
import { Brain, Layers, Network, Cpu, MessageSquare } from 'lucide-react';
import type { TrainingTopic, TrainingModuleDisplay } from '@/types/training';

// Type assertion for imported JSON
const topics = trainingContent as TrainingTopic[];

// Map topic IDs to icons
const topicIcons = {
    ai_ml_definition: Brain,
    ml_fields: Layers,
    nn_and_lm: Network,
    nn_types: Cpu,
    prompts_interaction: MessageSquare,
};

// Get all learning topics (excluding header and references)
export const getLearningTopics = (): TrainingTopic[] => {
    return topics.filter(
        (topic) => topic.id !== 'header' && topic.id !== 'references'
    );
};

// Get a specific topic by ID
export const getTopicById = (id: string): TrainingTopic | undefined => {
    return topics.find((topic) => topic.id === id);
};

// Generate display data for training modules (for main Training page)
export const getTrainingModules = (): TrainingModuleDisplay[] => {
    const learningTopics = getLearningTopics();

    return learningTopics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: getTopicDescription(topic),
        icon: topicIcons[topic.id as keyof typeof topicIcons] || Brain,
        estimatedTime: getEstimatedTime(topic),
    }));
};

// Extract a brief description from topic content
const getTopicDescription = (topic: TrainingTopic): string => {
    // Find the first paragraph in content
    const firstParagraph = topic.content.find(
        (item) => item.type === 'paragraph'
    );

    if (firstParagraph && firstParagraph.value) {
        // Truncate to reasonable length
        const text = firstParagraph.value as string;
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }

    return 'Изучите ключевые концепции искусственного интеллекта и машинного обучения';
};

// Estimate reading time based on content length
const getEstimatedTime = (topic: TrainingTopic): string => {
    const contentLength = JSON.stringify(topic.content).length;

    // Rough estimation: ~200 words per minute, ~5 chars per word
    const estimatedMinutes = Math.ceil(contentLength / (200 * 5));

    if (estimatedMinutes < 5) return '5 мин';
    if (estimatedMinutes < 60) return `${estimatedMinutes} мин`;

    const hours = Math.floor(estimatedMinutes / 60);
    const mins = estimatedMinutes % 60;
    return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
};

export { topics };

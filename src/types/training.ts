// TypeScript types for training content structure from ass-plug.json

export interface ContentItem {
    type: string;
    value?: any;
    title?: string;
    items?: any[];
    style?: string;
    content?: ContentItem[];
    term?: string;
    definition?: string;
    sub_items?: DefinitionItem[];
}

export interface DefinitionItem {
    term: string;
    definition: string;
    sub_items?: DefinitionItem[];
}

export interface ListItem {
    title?: string;
    content?: ContentItem[];
}

export interface TableContent {
    headers: string[];
    rows: string[][];
}

export interface HierarchyItem {
    level: number;
    name: string;
    description: string;
}

export interface TrainingTopic {
    id: string;
    title: string;
    content: ContentItem[];
}

export interface TrainingModuleDisplay {
    id: string;
    title: string;
    description: string;
    icon: any; // LucideIcon type
    estimatedTime?: string;
}

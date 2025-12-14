import React from 'react';
import type { ContentItem, DefinitionItem, TableContent, HierarchyItem } from '@/types/training';

interface LessonContentProps {
    content: ContentItem[];
}

export const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
    const renderContent = (item: ContentItem, index: number): React.ReactNode => {
        switch (item.type) {
            case 'heading':
                return (
                    <h2 key={index} className="text-3xl font-bold text-gradient mb-6 mt-8">
                        {item.value}
                    </h2>
                );

            case 'subheading':
                return (
                    <h3 key={index} className="text-xl font-semibold text-foreground mb-4 mt-6">
                        {item.value}
                    </h3>
                );

            case 'paragraph':
                return (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {item.value}
                    </p>
                );

            case 'key_thought':
                return (
                    <div key={index} className="glass border-l-4 border-primary p-4 rounded-r-xl mb-6 bg-primary/5">
                        <p className="text-foreground font-medium leading-relaxed">
                            💡 {item.value}
                        </p>
                    </div>
                );

            case 'quote':
                return (
                    <blockquote key={index} className="glass border-l-4 border-secondary p-4 rounded-r-xl mb-6 italic">
                        <p className="text-muted-foreground leading-relaxed">
                            {item.value}
                        </p>
                    </blockquote>
                );

            case 'list':
                return renderList(item, index);

            case 'table':
                return renderTable(item, index);

            case 'hierarchy':
                return renderHierarchy(item, index);

            case 'analogy':
                return renderAnalogy(item, index);

            case 'metadata':
                // Skip metadata in lesson content
                return null;

            default:
                return null;
        }
    };

    const renderList = (item: ContentItem, index: number): React.ReactNode => {
        const { style, items } = item;

        if (!items || items.length === 0) return null;

        // Handle different list styles
        if (style === 'numbered') {
            return (
                <ol key={index} className="list-decimal list-inside space-y-3 mb-6 text-muted-foreground">
                    {items.map((listItem, idx) => (
                        <li key={idx} className="ml-4">
                            {typeof listItem === 'string' ? (
                                <span className="ml-2">{listItem}</span>
                            ) : listItem.title ? (
                                <div className="ml-2">
                                    <span className="font-semibold text-foreground">{listItem.title}</span>
                                    {listItem.content && (
                                        <div className="ml-4 mt-2 space-y-2">
                                            {listItem.content.map((subItem: ContentItem, subIdx: number) => (
                                                <div key={subIdx}>{renderContent(subItem, subIdx)}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </li>
                    ))}
                </ol>
            );
        }

        if (style === 'bulleted') {
            return (
                <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground ml-4">
                    {items.map((listItem, idx) => (
                        <li key={idx}>
                            <span className="ml-2">{typeof listItem === 'string' ? listItem : listItem.title}</span>
                        </li>
                    ))}
                </ul>
            );
        }

        if (style === 'definitions') {
            return (
                <dl key={index} className="space-y-4 mb-6">
                    {items.map((defItem: DefinitionItem, idx) => (
                        <div key={idx} className="glass p-4 rounded-xl">
                            <dt className="font-semibold text-primary mb-2">{defItem.term}</dt>
                            <dd className="text-muted-foreground leading-relaxed">{defItem.definition}</dd>
                            {defItem.sub_items && defItem.sub_items.length > 0 && (
                                <div className="ml-4 mt-3 space-y-2">
                                    {defItem.sub_items.map((subItem, subIdx) => (
                                        <div key={subIdx} className="border-l-2 border-secondary/30 pl-3">
                                            <div className="font-medium text-sm text-secondary">{subItem.term}</div>
                                            <div className="text-sm text-muted-foreground">{subItem.definition}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </dl>
            );
        }

        return null;
    };

    const renderTable = (item: ContentItem, index: number): React.ReactNode => {
        const tableData = item.value as TableContent;
        if (!tableData || !tableData.headers || !tableData.rows) return null;

        return (
            <div key={index} className="mb-6 overflow-x-auto">
                {item.title && (
                    <h4 className="text-lg font-semibold text-foreground mb-3">{item.title}</h4>
                )}
                <table className="w-full glass rounded-xl overflow-hidden">
                    <thead className="bg-primary/10">
                        <tr>
                            {tableData.headers.map((header, idx) => (
                                <th key={idx} className="px-4 py-3 text-left font-semibold text-primary">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-t border-primary/10">
                                {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="px-4 py-3 text-muted-foreground">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderHierarchy = (item: ContentItem, index: number): React.ReactNode => {
        const items = item.items as HierarchyItem[];
        if (!items || items.length === 0) return null;

        return (
            <div key={index} className="mb-6 space-y-3">
                {items.map((hierarchyItem, idx) => (
                    <div
                        key={idx}
                        className="glass p-4 rounded-xl border-l-4 border-primary"
                        style={{ marginLeft: `${(hierarchyItem.level - 1) * 1.5}rem` }}
                    >
                        <div className="font-semibold text-primary mb-1">
                            {hierarchyItem.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {hierarchyItem.description}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderAnalogy = (item: ContentItem, index: number): React.ReactNode => {
        return (
            <div key={index} className="glass p-6 rounded-xl border border-accent/30 mb-6 bg-accent/5">
                {item.title && (
                    <h4 className="text-lg font-semibold text-accent mb-3 flex items-center gap-2">
                        <span>🔄</span> {item.title}
                    </h4>
                )}
                {item.items && (
                    <dl className="space-y-2">
                        {(item.items as DefinitionItem[]).map((analogyItem, idx) => (
                            <div key={idx} className="flex gap-2">
                                <dt className="font-medium text-foreground min-w-fit">{analogyItem.term}:</dt>
                                <dd className="text-muted-foreground">{analogyItem.definition}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        );
    };

    return (
        <div className="lesson-content space-y-4">
            {content.map((item, index) => renderContent(item, index))}
        </div>
    );
};

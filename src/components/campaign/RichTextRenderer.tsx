import React from 'react';

// Define the types for our content blocks
export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
}

export interface ImageBlock {
  id:string;
  type: 'image';
  url: string;
  width: number;
}

export type ContentBlock = TextBlock | ImageBlock;

interface RichTextRendererProps {
  blocks: ContentBlock[];
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ blocks }) => {
  // Guard against null or undefined blocks prop
  if (!blocks || !Array.isArray(blocks)) {
    return null;
  }

  return (
    // The 'prose' class from Tailwind's typography plugin is great for styling generated content
    <div className="prose prose-lg max-w-none">
      {blocks.map(block => {
        switch (block.type) {
          case 'text':
            // Render text blocks as paragraphs. 
            // 'whitespace-pre-wrap' ensures that newlines inside a block are respected.
            return (
              <p key={block.id} className="whitespace-pre-wrap">
                {block.content}
              </p>
            );
          
          case 'image':
            // Render image blocks, respecting the width property.
            return (
              <div key={block.id} className="flex justify-center my-6">
                <img 
                  src={block.url} 
                  alt="Campaign content" 
                  className="rounded-lg shadow-md border"
                  style={{ width: `${block.width || 100}%` }} // Default to 100% width
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default RichTextRenderer;
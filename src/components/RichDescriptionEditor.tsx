import React, { useRef, useEffect, useState } from 'react';
import { Image as ImageIcon, X, Move, ArrowUp, ArrowDown, Maximize2, Minimize2, AlertCircle, Type, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- INTERFACE HAS BEEN UPDATED ---
export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  width: number;
  status?: 'uploading' | 'uploaded' | 'error';
  errorMessage?: string;
}

export type ContentBlock = TextBlock | ImageBlock;

// --- PROPS HAVE BEEN UPDATED ---
interface RichDescriptionEditorProps {
  blocks: ContentBlock[];
  onChange: (blocksOrUpdater: ContentBlock[] | ((prevBlocks: ContentBlock[]) => ContentBlock[])) => void;
  placeholder?: string;
  className?: string;
}

// --- HELPER FUNCTION TO UPLOAD IMAGES ---
const uploadImageToSupabase = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const bucketName = 'campaign-description-images';

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error('Image upload failed. ' + uploadError.message);
  }

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  if (!data.publicUrl) {
    throw new Error('Could not get public URL for the uploaded image.');
  }

  return data.publicUrl;
};
// -----------------------------------------

const RichDescriptionEditor: React.FC<RichDescriptionEditorProps> = ({
  blocks,
  onChange,
  placeholder = 'Describe the product in detail...',
  className = ''
}) => {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  const generateBlockId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    const focusedIndex = blocks ? blocks.findIndex(b => b.id === focusedBlockId) : -1;

    const tempBlocks: ImageBlock[] = files.map(file => {
      // Validation from your code
      if (!file.type.startsWith('image/')) {
        setError('Please select image files only.');
        return null;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`Image "${file.name}" must be smaller than 5MB.`);
        return null;
      }
      return {
        id: generateBlockId('img'),
        type: 'image',
        url: URL.createObjectURL(file), // Temporary preview URL
        width: 100,
        status: 'uploading' // Initial status
      };
    }).filter((b): b is ImageBlock => b !== null);

    if (tempBlocks.length === 0) return;

    // Use a functional update to add all temporary blocks at once.
    // This prevents race conditions.
    onChange(currentBlocks => {
      const newBlocks = [...(currentBlocks || [])];
      newBlocks.splice(focusedIndex + 1, 0, ...tempBlocks);
      return newBlocks;
    });

    // Upload each file and update its specific block when done.
    tempBlocks.forEach((tempBlock, index) => {
      const file = files[index];
      uploadImageToSupabase(file)
        .then(finalUrl => {
          // On success, find the block by its ID and update its URL and status.
          onChange(latestBlocks =>
            latestBlocks.map(b =>
              b.id === tempBlock.id
                ? { ...b, url: finalUrl, status: 'uploaded' }
                : b
            )
          );
          URL.revokeObjectURL(tempBlock.url); // Clean up temporary URL
        })
        .catch(uploadError => {
          // On failure, find the block and update its status to 'error'.
          console.error("Upload failed:", uploadError);
          setError(uploadError.message || 'An image failed to upload.');
          onChange(latestBlocks =>
            latestBlocks.map(b =>
              b.id === tempBlock.id
                ? { ...b, status: 'error', errorMessage: uploadError.message }
                : b
            )
          );
        });
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, blockId: string) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId
        ? { ...block, content: e.target.value }
        : block
    );
    onChange(newBlocks as ContentBlock[]);
  };

  // --- No changes to other functions ---

  return (
    // Your JSX code for rendering goes here.
    // The key is to check `block.status` in your image block rendering logic
    // to show a loader or an error message. I've added a simple implementation below.
     <div
      ref={editorRef}
      className={`rich-description-editor border border-gray-300 rounded-lg overflow-hidden ${className} ${isResizing ? 'cursor-ew-resize' : ''}`}
    >
      <div className="space-y-4 p-4">
        {(blocks || []).map((block, index) => (
          <div key={block.id} className="relative group">
            {block.type === 'text' ? (
              // ... your text block rendering
            ) : ( // Image Block
              <div className="relative" style={{ width: `${block.width}%`, margin: '0 auto' }}>
                <div className="relative">
                  <img src={block.url} alt="Embedded content" className={`w-full rounded-lg border border-gray-200 ${block.status === 'uploading' || block.status === 'error' ? 'opacity-50' : ''}`} />
                  {/* Overlay for loading/error status */}
                  {block.status === 'uploading' && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white rounded-lg">
                         <Loader className="animate-spin w-8 h-8" />
                     </div>
                  )}
                  {block.status === 'error' && (
                     <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center text-white p-2 rounded-lg">
                         <AlertTriangle className="w-8 h-8 mb-1" />
                         <span className="text-xs text-center">{block.errorMessage || 'Upload Failed'}</span>
                     </div>
                  )}
                  {/* Your existing overlay for controls */}
                   {block.status === 'uploaded' && (
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          {/* ... your edit/move/delete buttons ... */}
                       </div>
                   )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* ... rest of your component */}
    </div>
  );
};

export default RichDescriptionEditor;
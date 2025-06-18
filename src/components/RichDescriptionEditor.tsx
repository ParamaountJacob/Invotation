import React, { useRef, useEffect, useState } from 'react';
import { Image as ImageIcon, X, Move, ArrowUp, ArrowDown, Maximize2, Minimize2, AlertCircle, Type, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- INTERFACES ---
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
  status?: 'uploading' | 'uploaded' | 'error'; // Keep status for potential future use
  errorMessage?: string;
}

export type ContentBlock = TextBlock | ImageBlock;

// --- PROPS INTERFACE ---
interface RichDescriptionEditorProps {
  blocks: ContentBlock[];
  onChange: (blocksOrUpdater: ContentBlock[] | ((prevBlocks: ContentBlock[]) => ContentBlock[])) => void;
  placeholder?: string;
  className?: string;
}

// --- HELPER FUNCTION ---
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

// --- COMPONENT ---
const RichDescriptionEditor: React.FC<RichDescriptionEditorProps> = ({
  blocks,
  onChange,
  placeholder = 'Describe the product in detail...',
  className = ''
}) => {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateBlockId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    setIsUploading(true);

    const focusedIndex = blocks ? blocks.findIndex(b => b.id === focusedBlockId) : -1;
    let newBlocks = [...(blocks || [])];

    for (const file of files) {
        if (!file.type.startsWith('image/')) {
            setError('Please select image files only.');
            continue;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError(`Image "${file.name}" must be smaller than 5MB.`);
            continue;
        }

        try {
            const finalUrl = await uploadImageToSupabase(file);
            const newImageBlock: ImageBlock = {
                id: generateBlockId('img'),
                type: 'image',
                url: finalUrl,
                width: 100,
                status: 'uploaded' // **Set status to 'uploaded' immediately**
            };

            // Insert the new block at the correct position
            if (focusedIndex !== -1) {
                newBlocks.splice(focusedIndex + 1, 0, newImageBlock);
            } else {
                newBlocks.push(newImageBlock);
            }
        } catch (uploadError: any) {
            console.error("Upload failed:", uploadError);
            setError(uploadError.message || 'An image failed to upload.');
        }
    }

    onChange(newBlocks);
    setIsUploading(false);
    
    // Reset the file input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  // --- Reordering Functions ---
  const handleMoveUp = (id: string) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index > 0) {
        const newBlocks = [...blocks];
        // Simple swap
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
        onChange(newBlocks);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index !== -1 && index < blocks.length - 1) {
        const newBlocks = [...blocks];
        // Simple swap
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        onChange(newBlocks);
    }
  };

  const handleRemoveBlock = (id: string) => {
    // Note: To be fully robust, you'd also delete the image from Supabase storage here.
    const newBlocks = blocks.filter(b => b.id !== id);
    onChange(newBlocks);
  };
  
  // Other handlers...
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, blockId: string) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId
        ? { ...block, content: e.target.value }
        : block
    );
    onChange(newBlocks as ContentBlock[]);
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };
  
  const addTextBlockAfter = (blockId: string | null) => {
    const newBlockId = generateBlockId('text');
    onChange(currentBlocks => {
        const safeBlocks = currentBlocks || [];
        const index = blockId ? safeBlocks.findIndex(b => b.id === blockId) : safeBlocks.length - 1;
        const newBlocks = [...safeBlocks];
        newBlocks.splice(index + 1, 0, { id: newBlockId, type: 'text', content: '' });
        setActiveBlockId(newBlockId);
        return newBlocks;
    });
  };

  return (
    <div className="rich-description-editor border border-gray-300 rounded-lg overflow-hidden">
        <div className="space-y-4 p-4">
            {(blocks || []).map((block, index) => (
                <div key={block.id} className="relative group">
                    {block.type === 'text' ? (
                        <div className="relative">
                            <textarea
                                value={(block as TextBlock).content}
                                onChange={(e) => handleTextChange(e, block.id)}
                                placeholder="Add more details..."
                                rows={Math.max(2, (block as TextBlock).content.split('\n').length)}
                                className="w-full p-2 border border-transparent focus:border-gray-300 rounded-md focus:ring-0 focus:outline-none resize-none transition-all"
                            />
                             <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={() => handleMoveUp(block.id)} disabled={index === 0} className="p-1 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50" title="Move up"><ArrowUp size={14} /></button>
                                <button type="button" onClick={() => handleMoveDown(block.id)} disabled={index === blocks.length - 1} className="p-1 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50" title="Move down"><ArrowDown size={14} /></button>
                                <button type="button" onClick={() => handleRemoveBlock(block.id)} className="p-1 bg-gray-200 rounded-full text-gray-700 hover:bg-red-500 hover:text-white transition-colors" title="Remove text block"><X size={14} /></button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative" style={{ width: `${(block as ImageBlock).width}%`, margin: '0 auto' }}>
                            <div className="relative">
                                <img src={(block as ImageBlock).url} alt="Campaign content" className="w-full rounded-lg border border-gray-200" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="absolute top-2 right-2 flex space-x-1">
                                         <button type="button" onClick={() => handleRemoveBlock(block.id)} className="p-1 bg-black/60 rounded-full text-white hover:bg-red-600 transition-colors" title="Remove image"><X size={16} /></button>
                                    </div>
                                    <div className="absolute left-2 top-2 flex flex-col space-y-1">
                                        <button type="button" onClick={() => handleMoveUp(block.id)} disabled={index === 0} className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50" title="Move up"><ArrowUp size={16} /></button>
                                        <button type="button" onClick={() => handleMoveDown(block.id)} disabled={index === blocks.length - 1} className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50" title="Move down"><ArrowDown size={16} /></button>
                                    </div>
                                    <button type="button" onClick={() => addTextBlockAfter(block.id)} className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors" title="Add text after image"><Type size={16} /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <p>{error}</p>
            </div>
        )}

        <div className="px-4 pb-4 flex space-x-2 border-t border-gray-200 pt-2">
            <button
                type="button"
                onClick={handleAddImage}
                disabled={isUploading}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <ImageIcon size={16} />}
                <span>{isUploading ? "Uploading..." : "Add Image"}</span>
            </button>
            <button type="button" onClick={() => addTextBlockAfter(null)} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors text-sm"><Type size={16} /><span>Add Text Block</span></button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={isUploading} />
        </div>
    </div>
  );
};

export default RichDescriptionEditor;
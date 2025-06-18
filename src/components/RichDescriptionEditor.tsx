import React, { useRef, useEffect, useState } from 'react';
import { Image as ImageIcon, X, Move, ArrowUp, ArrowDown, Maximize2, Minimize2, AlertCircle, Type, LoaderCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Corrected path from last time

// --- TYPES HAVE CHANGED ---
export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  width: number; // percentage of container width
  status?: 'uploading' | 'failed' | 'complete'; // Added for UI feedback
}

export type ContentBlock = TextBlock | ImageBlock;

interface RichDescriptionEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void; // IMPORTANT: This must now support functional updates
  placeholder?: string;
  className?: string;
}

const uploadImageToSupabase = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
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

  useEffect(() => {
    if (activeBlockId && textareaRefs.current[activeBlockId]) {
      const textarea = textareaRefs.current[activeBlockId];
      textarea?.focus();
      if (textarea && selectionStart !== null) {
        textarea.selectionStart = selectionStart;
        textarea.selectionEnd = selectionStart;
      }
    }
  }, [activeBlockId, selectionStart]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    const focusedIndex = blocks.findIndex(b => b.id === focusedBlockId);

    // Create all temporary blocks first
    const tempBlocks: ImageBlock[] = Array.from(files).map(file => {
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
            url: URL.createObjectURL(file),
            width: 100,
            status: 'uploading'
        };
    }).filter((b): b is ImageBlock => b !== null);

    if (tempBlocks.length === 0) return;

    // Add all temporary blocks to state in one go
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(focusedIndex + 1, 0, ...tempBlocks);
    onChange(updatedBlocks);

    // Start all uploads
    tempBlocks.forEach((tempBlock, i) => {
        const file = files[i];
        uploadImageToSupabase(file)
            .then(finalUrl => {
                URL.revokeObjectURL(tempBlock.url); // Clean up blob
                onChange(currentBlocks => currentBlocks.map(b =>
                    b.id === tempBlock.id
                        ? { ...b, url: finalUrl, status: 'complete' }
                        : b
                ));
            })
            .catch(uploadError => {
                console.error("Upload failed:", uploadError);
                setError(uploadError.message || 'An image failed to upload.');
                onChange(currentBlocks => currentBlocks.map(b =>
                    b.id === tempBlock.id
                        ? { ...b, status: 'failed' }
                        : b
                ));
            });
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
};

  const renderImageOverlay = (block: ImageBlock) => {
    if (block.status === 'uploading') {
        return (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white rounded-lg">
                <LoaderCircle className="animate-spin w-8 h-8" />
            </div>
        );
    }
    if (block.status === 'failed') {
        return (
            <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center text-white p-2 rounded-lg">
                <AlertTriangle className="w-8 h-8 mb-1" />
                <span className="text-xs text-center">Upload Failed</span>
            </div>
        );
    }
    return (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="absolute top-2 right-2 flex space-x-1">
                <button type="button" onClick={() => handleToggleFullWidth(block.id)} className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors" title={block.width === 100 ? "Make half width" : "Make full width"}>{block.width === 100 ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
                <button type="button" onClick={() => handleRemoveBlock(block.id)} className="p-1 bg-black/60 rounded-full text-white hover:bg-red-600 transition-colors" title="Remove image"><X size={16} /></button>
            </div>
        </div>
    );
  };
  
  // Keep the rest of your functions (handleTextChange, handleRemoveBlock, etc.) the same,
  // but update the main return block to use the new `renderImageOverlay` function.

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

  const handleTextareaFocus = (blockId: string, e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocusedBlockId(blockId);
    setActiveBlockId(blockId);
    setSelectionStart(e.target.selectionStart);
  };

  const handleSelectionChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    setSelectionStart(textarea.selectionStart);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, blockId: string, blockIndex: number) => {
    const textarea = e.currentTarget;
    
    if (e.key === 'Enter' && !e.shiftKey && textarea.selectionStart === textarea.value.length) {
      e.preventDefault();
      const newBlockId = generateBlockId('text');
      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, { id: newBlockId, type: 'text', content: '' });
      onChange(newBlocks);
      setActiveBlockId(newBlockId);
      setSelectionStart(0);
    }
    
    if (e.key === 'Backspace' && textarea.selectionStart === 0 && blockIndex > 0) {
      const prevBlock = blocks[blockIndex - 1];
      if (prevBlock.type === 'text') {
        e.preventDefault();
        const cursorPosition = prevBlock.content.length;
        const mergedContent = prevBlock.content + (blocks[blockIndex] as TextBlock).content;
        
        const newBlocks = [...blocks];
        newBlocks[blockIndex - 1] = { ...prevBlock, content: mergedContent };
        newBlocks.splice(blockIndex, 1);
        
        onChange(newBlocks);
        setActiveBlockId(prevBlock.id);
        setSelectionStart(cursorPosition);
      }
    }
  };

  const handleRemoveBlock = (id: string) => {
    const blockToRemove = blocks.find(b => b.id === id);
    if (blockToRemove?.type === 'image' && blockToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(blockToRemove.url);
    }

    let newBlocks = blocks.filter(b => b.id !== id);
    if (newBlocks.length === 0) {
        const newId = generateBlockId('text');
        newBlocks.push({ id: newId, type: 'text', content: '' });
        setActiveBlockId(newId);
    }
    onChange(newBlocks);
  };

  const handleMoveUp = (id: string) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index > 0) {
        const newBlocks = [...blocks];
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
        onChange(newBlocks);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index !== -1 && index < blocks.length - 1) {
        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        onChange(newBlocks);
    }
  };

  const handleToggleFullWidth = (id: string) => {
    const newBlocks = blocks.map(block => {
      if (block.id === id && block.type === 'image') {
        return { ...block, width: block.width === 100 ? 50 : 100 };
      }
      return block;
    });
    onChange(newBlocks as ContentBlock[]);
  };

  const handleResizeStart = (e: React.MouseEvent, id: string, currentWidth: number) => {
    setIsResizing(id);
    setResizeStartX(e.clientX);
    setInitialWidth(currentWidth);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleResizeMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isResizing || !editorRef.current) return;
    
    const deltaX = e.clientX - resizeStartX;
    const editorWidth = editorRef.current.offsetWidth;
    const percentageDelta = (deltaX / editorWidth) * 100;
    
    const newBlocks = blocks.map(block => {
        if (block.id === isResizing && block.type === 'image') {
            const newWidth = Math.max(20, Math.min(100, initialWidth + percentageDelta));
            return { ...block, width: newWidth };
        }
        return block;
    });
    onChange(newBlocks as ContentBlock[]);
  };

  const handleResizeEnd = () => setIsResizing(null);

  const addTextBlockAfter = (blockId: string | null) => {
    const newBlockId = generateBlockId('text');
    const safeBlocks = blocks || [];
    const index = blockId ? safeBlocks.findIndex(b => b.id === blockId) : safeBlocks.length - 1;
    
    const newBlocks = [...safeBlocks];
    newBlocks.splice(index + 1, 0, { id: newBlockId, type: 'text', content: '' });
    onChange(newBlocks);
    setActiveBlockId(newBlockId);
    setSelectionStart(0);
  };

  return (
    <div 
      ref={editorRef}
      className={`rich-description-editor border border-gray-300 rounded-lg overflow-hidden ${className}`}
      onMouseMove={(e) => { if (isResizing) handleResizeMove(e); }}
      onMouseUp={handleResizeEnd}
      onMouseLeave={handleResizeEnd}
    >
      <div className="space-y-4 p-4">
        {(blocks || []).map((block, index) => (
          <div key={block.id} className="relative group">
            {block.type === 'text' ? (
              <div className="relative">
                <textarea
                  ref={el => { if(el) textareaRefs.current[block.id] = el; }}
                  value={block.content}
                  onChange={(e) => handleTextChange(e, block.id)}
                  onFocus={(e) => handleTextareaFocus(block.id, e)}
                  onSelect={(e) => handleSelectionChange(e)}
                  onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                  placeholder={index === 0 && blocks.length === 1 ? placeholder : 'Add more details...'}
                  rows={Math.max(2, Math.min(10, block.content.split('\n').length))}
                  className="w-full p-2 border border-transparent focus:border-gray-300 rounded-md focus:ring-0 focus:outline-none resize-none transition-all"
                />
              </div>
            ) : ( // Image Block
              <div className="relative" style={{ width: `${block.width}%`, margin: '0 auto' }}>
                <div className="relative">
                  <img src={block.url} alt="Embedded content" className={`w-full rounded-lg border border-gray-200 ${block.status === 'uploading' || block.status === 'failed' ? 'opacity-50' : ''}`} />
                  {renderImageOverlay(block)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> <p>{error}</p>
        </div>
      )}
      
      <div className="px-4 pb-4 flex space-x-2 border-t border-gray-200 pt-2">
        <button type="button" onClick={handleAddImage} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors text-sm"><ImageIcon size={16} /><span>Add Image</span></button>
        <button type="button" onClick={() => addTextBlockAfter(blocks?.length > 0 ? blocks[blocks.length - 1].id : null)} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors text-sm"><Type size={16} /><span>Add Text Block</span></button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
      </div>
    </div>
  );
};

export default RichDescriptionEditor;
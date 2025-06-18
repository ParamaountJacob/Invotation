import React, { useRef, useEffect, useState } from 'react';
import { Image as ImageIcon, X, Move, ArrowUp, ArrowDown, Maximize2, Minimize2, AlertCircle, Type } from 'lucide-react';

// Block types to be exported and used by the parent
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
}

export type ContentBlock = TextBlock | ImageBlock;

// --- PROPS HAVE CHANGED ---
interface RichDescriptionEditorProps {
  blocks: ContentBlock[]; // Receives blocks directly
  onChange: (blocks: ContentBlock[]) => void; // Emits blocks directly
  placeholder?: string;
  className?: string;
}

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
  const textareaRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setError(null);
    let newBlocks = [...(blocks || [])]; // Defend against null/undefined
    let lastAddedBlockId: string | null = null;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
            setError('Please select image files only');
            continue;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB');
            continue;
        }
        
        const imageUrl = URL.createObjectURL(file);
        const newImageBlock: ImageBlock = {
            id: generateBlockId('img'),
            type: 'image',
            url: imageUrl,
            width: 100
        };
        lastAddedBlockId = newImageBlock.id;

        const focusedIndex = focusedBlockId ? newBlocks.findIndex(b => b.id === focusedBlockId) : -1;
        
        if (focusedIndex !== -1) {
            newBlocks.splice(focusedIndex + 1, 0, newImageBlock);
        } else {
            newBlocks.push(newImageBlock);
        }
    }
    
    onChange(newBlocks);
    if (lastAddedBlockId) {
        setActiveBlockId(lastAddedBlockId);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        {/* FIX: Add a fallback to an empty array to prevent 'map' of undefined error. */}
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
                {focusedBlockId === block.id && (
                  <div className="absolute right-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => handleRemoveBlock(block.id)} className="p-1 bg-gray-200 rounded-full text-gray-700 hover:bg-red-500 hover:text-white transition-colors" title="Remove text block"><X size={14} /></button>
                  </div>
                )}
              </div>
            ) : ( // Image Block
              <div className="relative" style={{ width: `${block.width}%`, margin: '0 auto' }}>
                <div className="relative">
                  <img src={block.url} alt="Embedded content" className="w-full rounded-lg border border-gray-200" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button type="button" onClick={() => handleToggleFullWidth(block.id)} className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors" title={block.width === 100 ? "Make half width" : "Make full width"}>{block.width === 100 ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
                      <button type="button" onClick={() => handleRemoveBlock(block.id)} className="p-1 bg-black/60 rounded-full text-white hover:bg-red-600 transition-colors" title="Remove image"><X size={16} /></button>
                    </div>
                    <div className="absolute left-2 top-2 flex flex-col space-y-1">
                      <button type="button" onClick={() => handleMoveUp(block.id)} disabled={index === 0} className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50" title="Move up"><ArrowUp size={16} /></button>
                      <button type="button" onClick={() => handleMoveDown(block.id)} disabled={index === blocks.length - 1} className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50" title="Move down"><ArrowDown size={16} /></button>
                    </div>
                    <button type="button" onClick={() => addTextBlockAfter(block.id)} className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors" title="Add text after image"><Type size={16} /></button>
                  </div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity" onMouseDown={(e) => handleResizeStart(e, block.id, block.width)} title="Resize image">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                  </div>
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
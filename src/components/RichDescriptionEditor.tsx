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
  status?: 'uploading' | 'uploaded' | 'error';
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
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  const generateBlockId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // --- IMAGE UPLOAD HANDLER (CORRECTED) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    const focusedIndex = blocks ? blocks.findIndex(b => b.id === focusedBlockId) : -1;

    const tempBlocks: ImageBlock[] = files.map(file => {
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

    onChange(currentBlocks => {
      const newBlocks = [...(currentBlocks || [])];
      newBlocks.splice(focusedIndex + 1, 0, ...tempBlocks);
      return newBlocks;
    });

    tempBlocks.forEach((tempBlock, index) => {
      const file = files[index];
      uploadImageToSupabase(file)
        .then(finalUrl => {
          onChange(latestBlocks =>
            latestBlocks.map(b =>
              b.id === tempBlock.id
                ? { ...b, url: finalUrl, status: 'uploaded' }
                : b
            )
          );
          URL.revokeObjectURL(tempBlock.url);
        })
        .catch(uploadError => {
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

  const handleAddImage = () => {
    fileInputRef.current?.click();
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
  
  const handleToggleFullWidth = (id: string) => {
    onChange(currentBlocks => currentBlocks.map(block => {
      if (block.id === id && block.type === 'image') {
        return { ...block, width: block.width === 100 ? 50 : 100 };
      }
      return block;
    }) as ContentBlock[]);
  };

  const addTextBlockAfter = (blockId: string | null) => {
    const newBlockId = generateBlockId('text');
    onChange(currentBlocks => {
        const safeBlocks = currentBlocks || [];
        const index = blockId ? safeBlocks.findIndex(b => b.id === blockId) : safeBlocks.length - 1;
        const newBlocks = [...safeBlocks];
        newBlocks.splice(index + 1, 0, { id: newBlockId, type: 'text', content: '' });
        setActiveBlockId(newBlockId);
        setSelectionStart(0);
        return newBlocks;
    });
  };

  return (
     <div
      ref={editorRef}
      className={`rich-description-editor border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      <div className="space-y-4 p-4">
        {(blocks || []).map((block) => (
          <div key={block.id} className="relative group">
            {block.type === 'text' ? (
              <textarea
                value={(block as TextBlock).content}
                onChange={(e) => handleTextChange(e, block.id)}
                placeholder={placeholder}
                className="w-full p-2 border border-transparent focus:border-gray-300 rounded-md focus:ring-0 focus:outline-none resize-none transition-all"
                rows={Math.max(2, Math.min(10, (block as TextBlock).content.split('\n').length))}
              />
            ) : ( // Image Block
              <div className="relative" style={{ width: `${(block as ImageBlock).width}%`, margin: '0 auto' }}>
                <div className="relative">
                  <img src={(block as ImageBlock).url} alt="Embedded content" className={`w-full rounded-lg border border-gray-200 ${(block as ImageBlock).status === 'uploading' || (block as ImageBlock).status === 'error' ? 'opacity-50' : ''}`} />
                  
                  {(block as ImageBlock).status === 'uploading' && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white rounded-lg">
                         <Loader className="animate-spin w-8 h-8" />
                     </div>
                  )}
                  {(block as ImageBlock).status === 'error' && (
                     <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center text-white p-2 rounded-lg">
                         <AlertTriangle className="w-8 h-8 mb-1" />
                         <span className="text-xs text-center">{(block as ImageBlock).errorMessage || 'Upload Failed'}</span>
                     </div>
                  )}
                   {(block as ImageBlock).status === 'uploaded' && (
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="absolute top-2 right-2 flex space-x-1">
                              <button type="button" onClick={() => handleToggleFullWidth(block.id)} className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors" title={(block as ImageBlock).width === 100 ? "Make half width" : "Make full width"}>{(block as ImageBlock).width === 100 ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
                              <button type="button" onClick={() => handleRemoveBlock(block.id)} className="p-1 bg-black/60 rounded-full text-white hover:bg-red-600 transition-colors" title="Remove image"><X size={16} /></button>
                          </div>
                          <button type="button" onClick={() => addTextBlockAfter(block.id)} className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors" title="Add text after image"><Type size={16} /></button>
                       </div>
                   )}
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
        <button
          type="button"
          onClick={handleAddImage}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors text-sm"
        >
          <ImageIcon size={16} /><span>Add Image</span>
        </button>
        <button type="button" onClick={() => addTextBlockAfter(blocks?.length > 0 ? blocks[blocks.length - 1].id : null)} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors text-sm"><Type size={16} /><span>Add Text Block</span></button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
      </div>
    </div>
  );
};

export default RichDescriptionEditor;
import React, { useState } from 'react';

type ContentBlock = {
  type: "paragraph" | "list" | "image" | "text-image";
  text?: string;
  listItems?: string[];
  imageUrl?: string;
  imagePosition?: "top" | "bottom" | "right";
};

type ContentBlockEditorProps = {
  block: ContentBlock;
  onUpdate: (updatedBlock: ContentBlock) => void;
  onDelete: () => void;
  uploadingImage: boolean;
  handleImageUpload: (file: File, blockIndex: number) => void;
  message: string;
};

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  block,
  onUpdate,
  onDelete,
  uploadingImage,
  handleImageUpload,
  message,
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ContentBlock['type'];
    let updatedBlock: ContentBlock = { type: newType };

    // Preserve existing data or set defaults based on new type
    if (newType === "paragraph") {
      updatedBlock.text = block.text || "";
    } else if (newType === "list") {
      updatedBlock.listItems = block.listItems && block.listItems.length > 0 ? block.listItems : [""];
    } else if (newType === "image") {
      updatedBlock.imageUrl = block.imageUrl || "";
    } else if (newType === "text-image") {
      updatedBlock.text = block.text || "";
      updatedBlock.imageUrl = block.imageUrl || "";
      updatedBlock.imagePosition = block.imagePosition || "bottom"; // Default position
    }
    onUpdate(updatedBlock);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...block, text: e.target.value });
  };

  const handleListItemChange = (index: number, value: string) => {
    const updatedListItems = [...(block.listItems || [])];
    updatedListItems[index] = value;
    onUpdate({ ...block, listItems: updatedListItems });
  };

  const addListItem = () => {
    onUpdate({ ...block, listItems: [...(block.listItems || []), ''] });
  };

  const removeListItem = (index: number) => {
    const updatedListItems = (block.listItems || []).filter((_, i) => i !== index);
    onUpdate({ ...block, listItems: updatedListItems });
  };

  const handleImagePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...block, imagePosition: e.target.value as ContentBlock['imagePosition'] });
  };

  return (
    <div className="p-4 border rounded-lg bg-emerald-700/30 border-violet-400/20 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold text-violet-200">Bloque de Contenido</h4>
        <button
          type="button"
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition duration-300"
        >
          Eliminar Bloque
        </button>
      </div>

      <div className="mb-2">
        <label className="block text-emerald-100 text-sm font-bold mb-1">Tipo:</label>
        <select
          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
          value={block.type}
          onChange={handleTypeChange}
        >
          <option value="paragraph">Párrafo</option>
          <option value="list">Lista Numerada</option>
          <option value="image">Imagen</option>
          <option value="text-image">Texto con Imagen</option>
        </select>
      </div>

      {(block.type === "paragraph" || block.type === "text-image") && (
        <div className="mb-2">
          <label className="block text-emerald-100 text-sm font-bold mb-1">Texto:</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100 h-20"
            value={block.text || ''}
            onChange={handleTextChange}
          ></textarea>
        </div>
      )}

      {block.type === "list" && (
        <div className="mb-2">
          <label className="block text-emerald-100 text-sm font-bold mb-1">Elementos de la Lista:</label>
          {(block.listItems || []).map((item, index) => (
            <div key={index} className="flex items-center mb-1">
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100 mr-2"
                value={item}
                onChange={(e) => handleListItemChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeListItem(index)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition duration-300"
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addListItem}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transition duration-300 mt-1"
          >
            + Añadir Elemento
          </button>
        </div>
      )}

      {(block.type === "image" || block.type === "text-image") && (
        <div className="mb-2">
          <label className="block text-emerald-100 text-sm font-bold mb-1">Subir Imagen:</label>
          <input
            type="file"
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
            onChange={(e) => handleImageUpload(e.target.files?.[0] as File, block.type === "image" ? 0 : 1)} // Placeholder index
            accept="image/*"
          />
          {uploadingImage && <p className="text-violet-300 text-xs italic mt-2">Subiendo imagen...</p>}
          {block.imageUrl && <p className="text-emerald-100 text-xs italic mt-2">URL: {block.imageUrl}</p>}
        </div>
      )}

      {block.type === "text-image" && (
        <div className="mb-2">
          <label className="block text-emerald-100 text-sm font-bold mb-1">Posición de la Imagen:</label>
          <select
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
            value={block.imagePosition || 'bottom'}
            onChange={handleImagePositionChange}
          >
            <option value="top">Arriba del Texto</option>
            <option value="bottom">Abajo del Texto</option>
            <option value="right">A la Derecha del Texto</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ContentBlockEditor;

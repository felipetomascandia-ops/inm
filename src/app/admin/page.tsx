"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContentBlockEditor from "../../components/ContentBlockEditor";

type ContentBlock = {
  type: "paragraph" | "list" | "image" | "text-image";
  text?: string;
  listItems?: string[];
  imageUrl?: string;
  imagePosition?: "top" | "bottom" | "right";
};

type Section = {
  id: string;
  title: string;
  icon: string;
  isShop?: boolean;
  blocks: ContentBlock[];
};

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSection, setNewSection] = useState<Section>({ title: "", icon: "", blocks: [] });
  const router = useRouter();

  useEffect(() => {
    // Check for authentication status (e.g., from session storage or local storage)
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      fetchSections();
    }
  }, []);

  const fetchSections = async () => {
    const res = await fetch("/api/comunidad");
    if (res.ok) {
      const data = await res.json();
      setSections(data);
    } else {
      setMessage("Error al cargar las tarjetas.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      fetchSections();
    } else {
      const data = await res.json();
      setMessage(data.message || "Error de autenticación.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    router.push("/admin"); // Redirect to login page
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/comunidad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSection),
    });

    if (res.ok) {
      setMessage("Tarjeta añadida correctamente.");
      setNewSection({ title: "", icon: "", blocks: [] });
      fetchSections();
    } else {
      const data = await res.json();
      setMessage(data.message || "Error al añadir la tarjeta.");
    }
  };

  const handleEditSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    setMessage("");
    const res = await fetch("/api/comunidad", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingSection),
    });

    if (res.ok) {
      setMessage("Tarjeta actualizada correctamente.");
      setEditingSection(null);
      fetchSections();
    } else {
      const data = await res.json();
      setMessage(data.message || "Error al actualizar la tarjeta.");
    }
  };

  const handleDeleteSection = async (id: string) => {
    setMessage("");
    const res = await fetch("/api/comunidad", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setMessage("Tarjeta eliminada correctamente.");
      fetchSections();
    } else {
      const data = await res.json();
      setMessage(data.message || "Error al eliminar la tarjeta.");
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false); // New state for image upload

  const handleImageUpload = async (
    file: File,
    sectionStateSetter: React.Dispatch<React.SetStateAction<Section | null>>,
    blockIndex: number
  ) => {
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        sectionStateSetter(prevSection => {
          if (!prevSection) return null;
          const updatedBlocks = [...prevSection.blocks];
          updatedBlocks[blockIndex] = { ...updatedBlocks[blockIndex], imageUrl: data.imageUrl };
          return { ...prevSection, blocks: updatedBlocks };
        });
        setMessage("Imagen subida correctamente.");
      } else {
        const data = await res.json();
        setMessage(data.message || "Error al subir la imagen.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error de red al subir la imagen.");
    } finally {
      setUploadingImage(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-900 to-emerald-900 text-white">
        <form onSubmit={handleLogin} className="p-8 rounded-lg shadow-xl bg-emerald-900/50 border border-violet-400/20">
          <h2 className="text-2xl font-bold mb-6 text-center text-violet-300">Acceso de Administrador</h2>
          <div className="mb-4">
            <label className="block text-emerald-100 text-sm font-bold mb-2" htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-emerald-100 text-sm font-bold mb-2" htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-500 to-emerald-600 hover:from-violet-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Iniciar Sesión
          </button>
          {message && <p className="text-red-400 text-xs italic mt-4 text-center">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-violet-900 to-emerald-900 text-white p-8">
      <div className="max-w-4xl mx-auto bg-emerald-900/50 p-8 rounded-lg shadow-xl border border-violet-400/20">
        <h1 className="text-3xl font-bold mb-6 text-violet-300">Panel de Administración de Comunidad</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-6 transition duration-300"
        >
          Cerrar Sesión
        </button>

        {message && <p className="text-green-400 text-sm italic mb-4">{message}</p>}

        {/* Añadir Nueva Tarjeta */}
        <div className="mb-8 p-6 rounded-lg bg-emerald-800/50 border border-violet-400/20">
          <h2 className="text-2xl font-bold mb-4 text-violet-300">Añadir Nueva Tarjeta</h2>
          <form onSubmit={handleAddSection} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-emerald-100 text-sm font-bold mb-2" htmlFor="newTitle">Título:</label>
              <input
                type="text"
                id="newTitle"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
                value={newSection.title}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-emerald-100 text-sm font-bold mb-2" htmlFor="newIcon">Icono (Emoji):</label>
              <input
                type="text"
                id="newIcon"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
                value={newSection.icon}
                onChange={(e) => setNewSection({ ...newSection, icon: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-2 text-violet-300">Bloques de Contenido</h3>
              {newSection.blocks.map((block, blockIndex) => (
                <ContentBlockEditor
                  key={blockIndex}
                  block={block}
                  onUpdate={(updatedBlock) => {
                    const updatedBlocks = [...newSection.blocks];
                    updatedBlocks[blockIndex] = { ...block, ...updatedBlock };
                    setNewSection({ ...newSection, blocks: updatedBlocks });
                  }}
                  onDelete={() => {
                    const updatedBlocks = newSection.blocks.filter((_, i) => i !== blockIndex);
                    setNewSection({ ...newSection, blocks: updatedBlocks });
                  }}
                  uploadingImage={uploadingImage}
                  handleImageUpload={(file) => handleImageUpload(file, setNewSection as React.Dispatch<React.SetStateAction<Section | null>>, blockIndex)}
                  message={message}
                />
              ))}
              <button
                type="button"
                onClick={() => setNewSection({
                  ...newSection,
                  blocks: [...newSection.blocks, { type: "paragraph", text: "" }]
                })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
              >
                + Añadir Bloque de Contenido
              </button>
            </div>
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="newIsShop"
                className="mr-2 leading-tight"
                checked={newSection.isShop || false}
                onChange={(e) => setNewSection({ ...newSection, isShop: e.target.checked })}
              />
              <label className="text-emerald-100 text-sm" htmlFor="newIsShop">Es una tarjeta de tienda (mostrará botón de Discord)</label>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-500 to-emerald-600 hover:from-violet-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                Añadir Tarjeta
              </button>
            </div>
          </form>
        </div>

        {/* Listar y Editar Tarjetas */}
        <div className="p-6 rounded-lg bg-emerald-800/50 border border-violet-400/20">
          <h2 className="text-2xl font-bold mb-4 text-violet-300">Tarjetas Existentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => (
              <div key={section.id} className="p-4 border rounded-lg bg-emerald-700/50 border-violet-400/20 shadow-md">
                {editingSection?.id === section.id ? (
                  <form onSubmit={handleEditSection}>
                    <div className="mb-2">
                      <label className="block text-emerald-100 text-sm font-bold mb-1" htmlFor={`editTitle-${index}`}>Título:</label>
                      <input
                        type="text"
                        id={`editTitle-${index}`}
                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
                        value={editingSection?.title || ''}
                        onChange={(e) => setEditingSection(prevEditingSection => {
                          const currentEditingSection = prevEditingSection!;
                          return { ...currentEditingSection, title: e.target.value };
                        })}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-emerald-100 text-sm font-bold mb-1" htmlFor={`editIcon-${index}`}>Icono:</label>
                      <input
                        type="text"
                        id={`editIcon-${index}`}
                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-violet-100"
                        value={editingSection?.icon || ''}
                        onChange={(e) => setEditingSection(prevEditingSection => {
                          const currentEditingSection = prevEditingSection!;
                          return { ...currentEditingSection, icon: e.target.value };
                        })}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 text-violet-300">Bloques de Contenido</h3>
                      {editingSection?.blocks.map((block, blockIndex) => (
                        <ContentBlockEditor
                          key={blockIndex}
                          block={block}
                          onUpdate={(updatedBlock) => {
                            const updatedBlocks = [...editingSection.blocks];
                            updatedBlocks[blockIndex] = { ...block, ...updatedBlock };
                            setEditingSection({ ...editingSection, blocks: updatedBlocks });
                          }}
                          onDelete={() => {
                            const updatedBlocks = editingSection.blocks.filter((_, i) => i !== blockIndex);
                            setEditingSection({ ...editingSection, blocks: updatedBlocks });
                          }}
                          uploadingImage={uploadingImage}
                          handleImageUpload={(file) => handleImageUpload(file, setEditingSection as React.Dispatch<React.SetStateAction<Section | null>>, blockIndex)}
                          message={message}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => setEditingSection(prevEditingSection => {
                          const currentEditingSection = prevEditingSection!;
                          return {
                            ...currentEditingSection,
                            blocks: [...currentEditingSection.blocks, { type: "paragraph", text: "" }]
                          };
                        })}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
                      >
                        + Añadir Bloque de Contenido
                      </button>
                    </div>                    <div className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`editIsShop-${index}`}
                        className="mr-2 leading-tight"
                        checked={editingSection?.isShop || false}
                        onChange={(e) => setEditingSection(prevEditingSection => {
                          const currentEditingSection = prevEditingSection!;
                          return { ...currentEditingSection, isShop: e.target.checked };
                        })}
                      />
                      <label className="text-emerald-100 text-sm" htmlFor={`editIsShop-${index}`}>Es de tienda</label>
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded mr-2 transition duration-300"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold py-1 px-3 rounded transition duration-300"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <div>
                    <h3 className="font-bold text-violet-200">{section.title}</h3>
                    <p className="text-emerald-100/70 text-sm">{section.icon} {section.blocks.length} bloques de contenido</p>
                    <p className="text-emerald-100/50 text-xs">{section.isShop ? "(Tienda)" : ""}</p>
                    <div className="mt-2">
                      <button
                        onClick={() => setEditingSection(section)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded mr-2 transition duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

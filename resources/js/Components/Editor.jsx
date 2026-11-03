/**
 * Editor.jsx
 * Editor de texto enriquecido usando TipTap.
 * Componente reutilizable para cualquier campo de texto largo.
 *
 * Props:
 * - value: string HTML del contenido
 * - onChange: función que recibe el HTML actualizado
 * - placeholder: texto de placeholder
 * - rows: altura aproximada en líneas (default: 8)
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Strikethrough, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

function BotonBarra({ onClick, activo, children, title }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded text-sm transition ${activo
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            {children}
        </button>
    );
}

export default function Editor({ value = '', onChange, placeholder = 'Escribe aquí...', minHeight = '150px' }) {

    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none p-3 scroll-teal overflow-y-auto',
                style: `min-height: ${minHeight}`,
            },
        },
        onUpdate({ editor }) {
            onChange?.(editor.getHTML());
        },
    });

    // Sincroniza si el valor cambia externamente
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value]);

    if (!editor) return null;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">

            {/* Barra de herramientas */}
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50 flex-wrap">
                <BotonBarra
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    activo={editor.isActive('bold')}
                    title="Negrita"
                >
                    <Bold className="w-4 h-4" />
                </BotonBarra>

                <BotonBarra
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    activo={editor.isActive('italic')}
                    title="Cursiva"
                >
                    <Italic className="w-4 h-4" />
                </BotonBarra>

                <BotonBarra
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    activo={editor.isActive('strike')}
                    title="Tachado"
                >
                    <Strikethrough className="w-4 h-4" />
                </BotonBarra>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <BotonBarra
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    activo={editor.isActive('bulletList')}
                    title="Lista"
                >
                    <List className="w-4 h-4" />
                </BotonBarra>

                <BotonBarra
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    activo={editor.isActive('orderedList')}
                    title="Lista numerada"
                >
                    <ListOrdered className="w-4 h-4" />
                </BotonBarra>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <BotonBarra
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Deshacer"
                >
                    <Undo className="w-4 h-4" />
                </BotonBarra>

                <BotonBarra
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Rehacer"
                >
                    <Redo className="w-4 h-4" />
                </BotonBarra>
            </div>

            {/* Área de edición */}
            <EditorContent editor={editor} />
        </div>
    );
}
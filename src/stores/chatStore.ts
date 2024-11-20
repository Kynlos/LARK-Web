import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileReference {
    path: string;
    startLine?: number;
    endLine?: number;
}

export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    fileRefs?: FileReference[];
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatSettings {
    temperature: number;
    maxTokens: number;
}

interface ChatState {
    chats: Chat[];
    activeChat: string | null;
    settings: ChatSettings;
    addChat: () => void;
    deleteChat: (id: string) => void;
    setActiveChat: (id: string) => void;
    addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
    updateSettings: (settings: Partial<ChatSettings>) => void;
    clearChat: (chatId: string) => void;
    renameChat: (chatId: string, title: string) => void;
}

const DEFAULT_SETTINGS: ChatSettings = {
    temperature: 0.7,
    maxTokens: 2000
};

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            chats: [],
            activeChat: null,
            settings: DEFAULT_SETTINGS,

            addChat: () => set(state => {
                const newChat: Chat = {
                    id: Date.now().toString(),
                    title: `New Chat ${state.chats.length + 1}`,
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                return {
                    chats: [...state.chats, newChat],
                    activeChat: newChat.id
                };
            }),

            deleteChat: (id: string) => set(state => ({
                chats: state.chats.filter(chat => chat.id !== id),
                activeChat: state.activeChat === id ? 
                    (state.chats[0]?.id || null) : 
                    state.activeChat
            })),

            setActiveChat: (id: string) => set({ activeChat: id }),

            addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => 
                set(state => {
                    const chat = state.chats.find(c => c.id === chatId);
                    if (!chat) return state;

                    const updatedChat = {
                        ...chat,
                        messages: [...chat.messages, {
                            ...message,
                            id: Date.now().toString(),
                            timestamp: new Date()
                        }],
                        updatedAt: new Date()
                    };

                    return {
                        chats: state.chats.map(c => 
                            c.id === chatId ? updatedChat : c
                        )
                    };
                }),

            updateSettings: (settings: Partial<ChatSettings>) => 
                set(state => ({
                    settings: { ...state.settings, ...settings }
                })),

            clearChat: (chatId: string) => set(state => ({
                chats: state.chats.map(chat => 
                    chat.id === chatId ? 
                        { ...chat, messages: [] } : 
                        chat
                )
            })),

            renameChat: (chatId: string, title: string) => set(state => ({
                chats: state.chats.map(chat => 
                    chat.id === chatId ? 
                        { ...chat, title } : 
                        chat
                )
            })),
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                chats: state.chats.map(chat => ({
                    ...chat,
                    messages: chat.messages.map(msg => ({
                        ...msg,
                        timestamp: msg.timestamp.toISOString()
                    })),
                    createdAt: chat.createdAt.toISOString(),
                    updatedAt: chat.updatedAt.toISOString()
                })),
                activeChat: state.activeChat,
                settings: state.settings
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.chats = state.chats.map(chat => ({
                        ...chat,
                        messages: chat.messages.map(msg => ({
                            ...msg,
                            timestamp: new Date(msg.timestamp)
                        })),
                        createdAt: new Date(chat.createdAt),
                        updatedAt: new Date(chat.updatedAt)
                    }));
                }
            }
        }
    )
);

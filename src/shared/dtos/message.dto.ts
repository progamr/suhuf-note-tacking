export interface MessageDto {
    id: number;
    content: string;
    role: 'user' | 'assistant';
    createdAt: string;
}
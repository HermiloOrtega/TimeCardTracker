import { useState, useEffect } from 'react';
import type { TodoItem } from '../models/types';
import { generateId } from '../utils/uuidUtils';
import { apiGetTodos, apiAddTodo, apiUpdateTodo, apiDeleteTodo } from '../services/apiService';

export function useTodos() {
  const [todos, setTodosState] = useState<TodoItem[]>([]);

  useEffect(() => {
    apiGetTodos().then(setTodosState).catch(console.error);
  }, []);

  async function addTodo(title: string, note?: string): Promise<void> {
    const trimmed = title.trim();
    if (!trimmed) return;
    const t: TodoItem = { id: generateId(), title: trimmed, note: note?.trim() || undefined, createdAt: new Date().toISOString() };
    await apiAddTodo(t, todos.length);
    setTodosState(prev => [...prev, t]);
  }

  async function updateTodo(id: string, title: string, note?: string): Promise<void> {
    const trimmed = title.trim();
    if (!trimmed) return;
    const updated = todos.map(t => t.id === id ? { ...t, title: trimmed, note: note?.trim() || undefined } : t);
    const t = updated.find(x => x.id === id)!;
    await apiUpdateTodo(t, updated.indexOf(t));
    setTodosState(updated);
  }

  async function deleteTodo(id: string): Promise<void> {
    await apiDeleteTodo(id);
    setTodosState(prev => prev.filter(t => t.id !== id));
  }

  async function duplicateTodo(id: string): Promise<void> {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const copy: TodoItem = { ...todo, id: generateId(), createdAt: new Date().toISOString() };
    await apiAddTodo(copy, todos.length);
    setTodosState(prev => [...prev, copy]);
  }

  async function clearAllTodos(): Promise<void> {
    await Promise.all(todos.map(t => apiDeleteTodo(t.id)));
    setTodosState([]);
  }

  return { todos, addTodo, updateTodo, deleteTodo, duplicateTodo, clearAllTodos };
}

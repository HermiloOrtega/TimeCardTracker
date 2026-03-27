import { useState } from 'react';
import type { TodoItem } from '../models/types';
import { getTodos, setTodos } from '../services/storageService';
import { generateId } from '../utils/uuidUtils';

export function useTodos() {
  const [todos, setTodosState] = useState<TodoItem[]>(() => getTodos());

  function addTodo(title: string, note?: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    const next: TodoItem[] = [
      ...todos,
      { id: generateId(), title: trimmed, note: note?.trim() || undefined, createdAt: new Date().toISOString() },
    ];
    setTodosState(next);
    setTodos(next);
  }

  function updateTodo(id: string, title: string, note?: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    const next = todos.map(t =>
      t.id === id ? { ...t, title: trimmed, note: note?.trim() || undefined } : t
    );
    setTodosState(next);
    setTodos(next);
  }

  function deleteTodo(id: string): void {
    const next = todos.filter(t => t.id !== id);
    setTodosState(next);
    setTodos(next);
  }

  function duplicateTodo(id: string): void {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const copy: TodoItem = { ...todo, id: generateId(), createdAt: new Date().toISOString() };
    const next = [...todos, copy];
    setTodosState(next);
    setTodos(next);
  }

  function clearAllTodos(): void {
    setTodosState([]);
    setTodos([]);
  }

  return { todos, addTodo, updateTodo, deleteTodo, duplicateTodo, clearAllTodos };
}

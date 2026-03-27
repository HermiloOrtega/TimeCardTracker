import { useState, useEffect } from 'react';
import type { AppSettings, Theme, TimeRange } from '../models/types';
import { getSettings, setSettings } from '../services/storageService';

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => getSettings());

  // Apply theme to document root whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  function setTheme(theme: Theme): void {
    const next = { ...settings, theme };
    setSettingsState(next);
    setSettings(next);
  }

  function setTimeRange(timeRange: TimeRange): void {
    const next = { ...settings, timeRange };
    setSettingsState(next);
    setSettings(next);
  }

  return { settings, setTheme, setTimeRange };
}

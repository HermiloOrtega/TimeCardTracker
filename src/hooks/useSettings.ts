import { useState, useEffect } from 'react';
import type { AppSettings, Theme, TimeRange } from '../models/types';
import { apiGetSettings, apiSaveSettings } from '../services/apiService';

const DEFAULT_SETTINGS: AppSettings = { theme: 'light', timeRange: 'extended' };

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    apiGetSettings().then(setSettingsState).catch(console.error);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  async function setTheme(theme: Theme): Promise<void> {
    const next = { ...settings, theme };
    setSettingsState(next);
    await apiSaveSettings(next);
  }

  async function setTimeRange(timeRange: TimeRange): Promise<void> {
    const next = { ...settings, timeRange };
    setSettingsState(next);
    await apiSaveSettings(next);
  }

  return { settings, setTheme, setTimeRange };
}

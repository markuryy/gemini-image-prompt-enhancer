import { useState, useEffect } from 'react';
import presets from '@/data/presets.json';

export function usePresets() {
  const [presetNames, setPresetNames] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState("SD1.5");

  useEffect(() => {
    setPresetNames(Object.keys(presets));
  }, []);

  return { presetNames, selectedPreset, setSelectedPreset };
}

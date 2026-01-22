// Sound effects URLs (royalty-free sounds)
export const SOUNDS = {
  correct: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
  wrong: "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3",
  levelUp: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  complete: "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3",
  streak: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
};

// Simple audio player hook
export const useGameSounds = () => {
  const audioRef = new Map<string, HTMLAudioElement>();

  const preloadSounds = () => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.volume = 0.5;
      audioRef.set(key, audio);
    });
  };

  const playSound = (sound: keyof typeof SOUNDS) => {
    const audio = audioRef.get(sound);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Audio play failed, likely due to autoplay policy
      });
    } else {
      // Fallback: create and play
      const newAudio = new Audio(SOUNDS[sound]);
      newAudio.volume = 0.5;
      newAudio.play().catch(() => {});
    }
  };

  return { playSound, preloadSounds };
};
